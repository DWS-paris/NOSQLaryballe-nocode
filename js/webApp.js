// Wait for DOM content
$(document).ready( () => {
  /*
   * Class CollectionClass 
   * Define all the methode needed to manipulate data
  */
    class CollectionClass {
      // Methode to fetch data from json|api|DB|...
      fetched (cbk) {
        $.ajax({
          dataType: "json",
          url: "./data/db.json",
          success: cbk,
          error: err => console.error(err)
        })
      };

      insert (doc) {
        alert('TODO: write method to insert data');
      };

      remove (doc) {
        alert('TODO: write method to remove data');
      };
    };

    // Instanciate collection
    let myCollection = new CollectionClass()
  //



  /*
   * Potree configuration
   * Define object and methods for Potree
  */
    // Define Potree viewer
    window.viewer = new Potree.Viewer(document.getElementById("potree_render_area"));
    viewer.setEDLEnabled(true);
    viewer.setDescription("Annotation Creation");

    // Load Potree pointclouds
    Potree.loadPointCloud("../pointclouds/vol_total/cloud.js", "Sorvilier", e => {
      // Add points on scene
      viewer.scene.addPointCloud(e.pointcloud);
      viewer.fitToScreen();
    });

    // Method to display an array of annotations
    const showAnnotations = (annotations) => {
      console.log('Annotation array received: ', annotations);

      let annotationsRoot = $("#jstree_scene").jstree().get_node("annotations");
      $("#jstree_scene").jstree().delete_node(annotationsRoot.children);
      viewer.scene.getAnnotations().removeAllChildren();
      annotations.forEach( annotation => drawAnnotation(annotation));
    };

    // Method to draw annotation
    const drawAnnotation = (data) => {
      // Draw annotation in Potree view
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
      });
      console.log('Annotation drawed: ', data);
    };

    // Method to display annotation form for title definition
    const selectItem = (event) => {
      // Select DOM element, change content & display
      let content = $(`#menu_annotate`).html(`
        <div class="pv-menu-list">
          <label for="annotation-title">Title</title><br/>
          <input type="text" id="annotation-title" name="annotation-title"></br>
          <input type="button" value="Convert To Annotation" id="createAnnotationBtn">
        </div>
      `).show();

      // Bind click envent to create annotation
      $(`#createAnnotationBtn`, content).click((o) => {
        let title = $(`#annotation-title`, content).val();
        if (!title) return null;

        // Insert new annotation in collection
        myCollection.insert({
          _id: event.target.uuid,
          position: event.target.points[0].position.toArray(),
          cameraPosition: [viewer.scene.view.position.x, viewer.scene.view.position.y, viewer.scene.view.position.z],
          cameraTarget: [viewer.scene.view.getPivot().x, viewer.scene.view.getPivot().y, viewer.scene.view.getPivot().z],
          title: title
        });

        // Reset measurement
        viewer.scene.removeMeasurement(event.target);
      });
      console.log('Event trigged: ', event);
    };
    
    // Method called when 'measurement_added' Potree event trigged
    const onItemAdded = (event) => {
      if (event.measurement && event.measurement.name === "Point") event.measurement.addEventListener('marker_dropped', selectItem);
      console.log('Potree "measurement_added" trigged: ', event);
    };

    // Method called when 'measurement_removed' Potree event trigged
    const onItemRemoved = (event) => {
      deselectItem();
      if (event.measurement && event.measurement.name === "Point") event.measurement.removeEventListener('marker_dropped', selectItem);
      console.log('Potree "measurement_removed" trigged: ', event);
    };

    // Method to reset #menu_annotate
    const deselectItem = (args) => {
      let content = $(`#menu_annotate`).html(`
        <div class="pv-menu-list">
          <p><strong>Select a point measure first!</strong></p>
          <p>You will be able to convert it to an annotation.</p>
        </div>
      `);
      console.log('DOM "#menu_annotate" reseted');
    };
  // 



  /*
   * User interface
   * Define sidebar and fetch data 
  */
    viewer.loadGUI(() => {
      // Define sidebar content
      let section = $(`
        <h3 class="accordion-header ui-widget"><span>Annotation Creation</span></h3>
        <div class="accordion-content ui-widget pv-menu-list" id="menu_annotate" >
        <div class="pv-menu-list">
            <p><strong>Select a point measure first!</strong></p>
            <p>You will be able to convert it to an annotation.</p>
          </div>
        </div>
      `).insertBefore($('#menu_tools'));
      
      // Set UI animation
      viewer.toggleSidebar();
      section.first().click(() => content.slideToggle());

      // Bind Potree events
      viewer.scene.addEventListener("measurement_added", onItemAdded);
      viewer.scene.addEventListener("measurement_removed", onItemRemoved);

      // Fecth data
      myCollection.fetched(showAnnotations)

      console.log('User interface loaded: ', viewer)
    });
  //
});