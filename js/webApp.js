// Wait for DOM content
document.addEventListener('DOMContentLoaded', () => {
  
  /*
   * Class CollectionClass 
   * Define all the methode needed
   * to manipulate data
  */
    class CollectionClass {
      // Methode to fetch data from json|api|DB|...
      fetched (cbk) {
        $.ajax({
          dataType: "json",
          url: "points.json",
          success: cbk,
        })
      }

      // TODO: write methode to insert data
      insert (doc) {
        alert('TODO')
      }

      // TODO: write methode to remove data
      remove (doc) {
        alert('TODO')
      }

    }

    // Instanciate collection
    let myCollection = new CollectionClass()
  //

  /*
   * Potree configuration
   * Define object and methods for Potree
  */
    window.viewer = new Potree.Viewer(document.getElementById("potree_render_area"));
    viewer.setEDLEnabled(true);
    viewer.setDescription("Annotation Creation");

    // Method to display an array of annotations
    const showAnnotations = (annotations) => {
      // bug fix: no remove annotation event fired within potree
      let annotationsRoot = $("#jstree_scene").jstree().get_node("annotations");
      $("#jstree_scene").jstree().delete_node(annotationsRoot.children)
      viewer.scene.getAnnotations().removeAllChildren()
      annotations.forEach( annotation => drawAnnotation(annotation))
    }

    // Method to draw annotation
    const drawAnnotation = (data) => {
      let a = viewer.scene.addAnnotation(data.position, {
        title: data.title,
        cameraPosition: data.cameraPosition,
        cameraTarget: data.cameraTarget,
        "actions": [{
          "icon": Potree.resourcePath + "/icons/remove.svg",
          "onclick": function() {
            if (confirm("Remove this annotation ?")) {
              myCollection.remove(data);
            }
          }
        }]
      })
    }

    // Method to display annotation form for title definition
    const selectItem = (event) => {
      let content = $(`#menu_annotate`);
      content.html(`
        <div class="pv-menu-list">
          <label for="annotation-title">Title</title><br/>
          <input type="text" id="annotation-title" name="annotation-title"></br>
          <input type="button" value="Convert To Annotation" id="createAnnotationBtn">
        </div>
      `);
      content.show()
      $(`#createAnnotationBtn`, content).click((o) => {
        let title = $(`#annotation-title`, content).val()
        if (!title) {
          return null
        }
        myCollection.insert({
          _id: event.target.uuid,
          position: event.target.points[0].position.toArray(),
          cameraPosition: [viewer.scene.view.position.x, viewer.scene.view.position.y, viewer.scene.view.position.z],
          cameraTarget: [viewer.scene.view.getPivot().x, viewer.scene.view.getPivot().y, viewer.scene.view.getPivot().z],
          title: title
        })
        viewer.scene.removeMeasurement(event.target)
      })
      console.log(event)
    }

    const deselectItem = (args) => {
      console.log('onVolumeRemoved',args)
      let content = $(`#menu_annotate`);
      content.html(`
      <div class="pv-menu-list">
      <strong>Select a point measure first!</strong><br>
      <br>
      You will be able to convert it to an annotation.<br>
      </div>
      `);
    }

    const onItemAdded = (event) => {
      console.log('onItemAdded', event)
      if (event.measurement && event.measurement.name === "Point") {
        event.measurement.addEventListener('marker_dropped', selectItem)
      }
    }

    const onItemRemoved = (event) => {
      console.log('onItemRemoved', event)
      deselectItem()
      if (event.measurement && event.measurement.name === "Point") {
        event.measurement.removeEventListener('marker_dropped', selectItem)
      }
    }

    viewer.loadGUI(() => {
      viewer.toggleSidebar();

      let section = $(`
        <h3 class="accordion-header ui-widget"><span>Annotation Creation</span></h3>
        <div class="accordion-content ui-widget pv-menu-list" id="menu_annotate" ></div>
      `);

      let content = section.last();
      content.html(`
      <div class="pv-menu-list">
        <strong>Select a point measure first!</strong><br>
        <br>
        You will be able to convert it to an annotation.<br>
      </div>
      `);
      section.first().click(() => content.slideToggle());
      section.insertBefore($('#menu_tools'));
      viewer.scene.addEventListener("measurement_added", onItemAdded);
      viewer.scene.addEventListener("measurement_removed", onItemRemoved);
      myCollection.fetched(showAnnotations)

    });

    // Load Potree pointclouds
    Potree.loadPointCloud("../pointclouds/vol_total/cloud.js", "Sorvilier", e => {
      viewer.scene.addPointCloud(e.pointcloud);
      viewer.fitToScreen();
    });
  //
})