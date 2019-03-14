![Keep calm and mongo](./img/coverKeep.jpg)

## Les bases de données
A l'instar de n'importe quel système de base de données, [MongoDB](https://docs.mongodb.com/manual/administration/install-community/) permet de gérer plusieurs collections de données au sein d'un même server. Une notion est néanmoins bien différentes avec [MongoDB](https://docs.mongodb.com/manual/administration/install-community/) et peut s'avérer déroutant : les documents enregistrés dans une collection n'ont pas besoin d'être de même type. Contrairement aux bases de données relationnelles les bases de données NoSQL n'ont besoin pour stocker les entrées que d'une `_id`, mais il va de soit qu'en termes de développement il est conseillé de structurer de façon strict les données d'une collection.

### Commande db
La commande `db` permet d'afficher le nom de la base de données active.
```
db
```

### Commandes show dbs
La commande `show dbs` permet de lister les base de données.
```
show dbs
```

### Commandes db use
La commande `db use` permet à la fois de sélectionner ou de crèer une base de données.
```
db use MyDatabase
```
> La commande `db`correspont à présent à la base de données `MyDatabase`

### Fonction dropDatabase()
La fonction `dropDatabase()` permet de vider complètement une base de données.
```
db.dropDatabase()
```

## Les collections
MongoDB fonctionne sur le principe de documents et de collection d'objets : un document est un ensemble de données au format js et une collection est l'équivalent d'une table dans une BDD relationalle.

### Fonction createCollection()
La fonction `createCollection()` permet de créer une collection
```
db.createCollection('myCollection')
```
### Fonction drop()
La fonction `drop()` permet de vider une collection
```
db.myCollection.drop()
```

## Les documents
Les données enregistrées dans les collections MongoDB le sont sous la forme de documents au format BSON qui est une représentation binaire de documents js, bien qu'il contienne plus de types de données que le js. C'est documents sont composés de couples clès-valeurs qui peuvent être de différents types comme le montre l'exemple suivant :
```js
{
    _id: ObjectId("5099803df3f4948bd2f98391"),
    title: "Installer MongoDB",
    duration: 20,
    isDone: false,
    tags: ["config", "install"],
    author: {
        name: "John Doe"
    }
}
```

Tous les type de valeur sont possible dans les propriété des documents, de l'obbjet complèxe à la fonction Date(), les possibilités sont immences. Il est à noter que la propriété `_id` est créée automatiquement par le système MongoDB et qu'il représente la clès unique qui permet d'identifier tous les objets des collections.

### Fonction insert()
La fonction `insert()` permet d'ajouter un document dans une collection.
```js
db.myCollection.insert({
    title: "Installer MongoDB",
    duration: 120,
    isDone: false,
    tags: ["config", "install"],
    author: {
        name: "John Doe"
    }
})
```
> La fonction `insert()` est recursive et permet de créer une collection si elle est inexistante

Pour ajouter plusieurs documents il suffi de renseigner un tableau dans la fonction `insert()`
```js
db.myCollection.insert([
    { title: "Configurer le shell", duration: 20, isDone: false, tags: ["config", "shell"], author: { name: "John Doe" } },
    { title: "Créer des collections", duration: 70, isDone: false, tags: ["create", "collection"], author: { name: "Jane Doe" } },
    { title: "Créer des documents", duration: 100, isDone: false, tags: ["create", "documents"], author: { name: "Jane Doe" } }
])
```

### Fonction find()
La fonction `find()` permet d'afficher le contenu d'une collection
```
db.myCollection.find().pretty()
```
> Le drapeau `pretty()` améliore l'affichage du résultat

Pour n'afficher que les objets qui correspondent à certaines clefs-valeurs, il faut les indiquer en paramêtre de la fonction
```js
db.myCollection.find({ "title": "Configurer le shell" })).pretty()
```

Il est possible de rechercher dans le tableau de la même manière mais nous pouvons définir deux valeurs à rechercher
```js
db.myCollection.find(
    { "tags": {
            $in: ["install", "shell"]
        }
    }
)).pretty()
```

Il est également possible de rechercher parmi les propriétés d'un objet situé dans un document en utilisant la la méthode objet classique
```js
db.myCollection.find({ "author.name": "Jane Doe" })).pretty()
```

Les opérateurs de comparaisons (>, !=, &&, ...) n'existent pas dans MongoDB, il est néanmoins possible de filtrer les valeurs supérieures à x en utilisant l'opérateur de comparaison `$gt`
```js
db.myCollection.find( { duration:{ $gt: 100 } } )).pretty()
```
Les autres opérateurs de comparaison s'utilisent de la même manière :

- $gt : plus grand que
- $lt : plus petit que
- $gte : plus grand ou égal à
- $lte: plus petit ou égal à

Les opérateurs de comparaisons peuvent être utilisés à plusieurs pour effectuer des recherches plus précises
```js
db.myCollection.find( { duration: { $gt: 100, $lt: 150 } } )).pretty()
```

Pour classer dans un orde croissant ou décroissant les résultats d'une recherche il faut utiliser la fonction `sort()`
```js
db.myCollection.find(
    { "duration": { $gte:70 } })
    .sort({ "duration" :-1 }

).pretty()
```
> Pour afficher les résultats dans un order croissant il faut définir la valeur à 1

Pour filtrer le resultat il faut un objet de configuration à la récherche et définir les propriétés à afficher en leurs donnant la valeur `0`
```js
db.myCollection.find({ isDone: false }, { title:1, _id:0 })).pretty()
```
> La valeur de la propriété `_id` est affichée par défaut, nous la masquons dans ce résultat

### Fonction update()
La fonction `update()` permet de mettre à jour un document
```js
db.myCollection.update(
    { "title": "Installer MongoDB" },
    { $set: {
        isDone : true
        }
    }
)
```
> La fonction `update()` est incursive et permet également d'ajouter des propriétés au document

Pour mettre à jour plusieurs documents il faut ajouter une propriété `multi`
```js
db.myCollection.update(
    { "tags": "config" },
    { $set: {
        isDone: true
        }
    },
    { multi: true }
)
```

Pour mettre à jour ou ajouter une propriété dans un objet il faut utiliser un objet de configuration `$set`
```js
db.myCollection.update(
    { "author.name": "John Doe" },
    { $set: {
            "author.gender":"male"
        }
    },
    { multi: true }
)
```
> Le dernier objet `{ multi: true }` permet de modifier plusieurs documents

Pour supprimer une propriété dans un objet il faut utiliser un objet de configuration `$unset`
```js
db.myCollection.update(
    { "author.name": "John Doe" },
    { $unset: {
            "author.gender":1
        }
    }
)
```

Pour ajouter une valeur dans un tableau, il faut utiliser un objet de configuration `$push`
```js
db.myCollection.update(
    { duration:{ $gte: 100 } },
    { $push: {
            "tags": "longer"
        }
    }
)
```

Pour s'assurer qu'il n'y ai pas de doublon dans le tableau, il faut utiliser un objet de configuration `$addToSet` à la place de `$push`
```js
db.myCollection.update(
    { duration:{ $gte: 100 } },
    { $addToSet: {
            "tags": "longer"
        }
    },
    { multi: true }
)
```

Pour supprimer une valeur dans un tableau, il faut utiliser un objet de configuration `$pull`
```js
db.myCollection.update(
    { duration:{ $gte: 100 } },
    { $pull: {
            "tags": "longer"
        }
    },
    { multi: true }
)
```

### Fonction remove()
La fonction `remove()` permet de supprimer un document
```js
db.myCollection.remove({ title:"Configurer MongoDB" })
```
> Pour supprimer plusieurs document il faut ajouter un objet de configuration `{ multi: true }`

<hr>

### Références
- [Base de données du NOsql](http://nosql-database.org)
- [Base de données orientée documents](https://fr.wikipedia.org/wiki/Base_de_données_orientée_documents)
- [MongoDB Community Edition](https://www.mongodb.com/community)
- [MongoDB by Derek Banas - Youtube](https://www.youtube.com/watch?v=-0X8mr6Q8Ew)

### Auteurs
- Damien Truffaut [Linkedin](https://www.linkedin.com/in/damient75/)
- Julien Noyer [Linkedin](https://www.linkedin.com/in/julien-noyer-21219b28/)
