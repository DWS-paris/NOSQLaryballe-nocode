---
title: NoSQL - Evaluation
date: 2018/05/03
---

# ARYBALLE PROJECT
Play with Lidar data and NoSQL technologies

![Aryballe Project homepage](./img/aryballeCover.png)

## Présentation du projet

Le principe de ce projet est de permettre d'explorer les différentes notions de gestion de documents (stockage, transfert, traitement, ...) et de visualisation de ces documents selon leur contexte (opaque, structuré, modifiable, ...). Nous partons du principe ou le métier - _sujet_ - est à prendre comme outil de base pour la mise en place de structures traitant des données car une fois le model de document défini le choix de tel ou tel technologie de gestion de données devient alors un levier pour décupler l'efficacité et l'exécution d'une application.

Basé sur les données [Lidar](https://fr.wikipedia.org/wiki/Lidar), le Aryballe Project permet de visualiser une carte en 3 dimensions et offre des outils pour identifier les différents éléments qui constituent la carte. L'indexation des différents points de la carte est à faire par plusieurs membres d'une équipe dans des environnements différents qui doivent être synchronisés en temps réel pour afficher les mêmes informations.

__Sources__ : <https://bit.ly/2Jsiw2E>

## Définition des problématiques

- Les informations à manipuler sont de natures diverses mais doivent interagir les unes avec les autres
- Les modes de productions de l'information sont multiples et doivent être évolutives
- Chaque type d'information doit avoir une structure spécifique défini par l'information elle-même
- La méthode de stockage doit être définie selon l'utilisation métier de information
- Les stratégies de redistribution doivent permettre d'optimiser l'accès à l'information

## Rendu et attentes

Au-delà d'un production de code, la travail demandé est avant une analyse complète et argumenté du projet, des problématiques et des solutions choisies pour y répondre. Vous devrez, en équipe, produire une documentation complète sur votre travail de recheche et être capable de justifier chacun des choix que vous aurez fait pour répondre aux problématiques du projet. La restitution que vous devez faire prend 2 formes obligatoires et 1 recommandée : 1 document technique de présentation, 1 schema fonctionnel au format A4 et 1 développement.

### Document technique de présentation (obligatoire)

Votre document doit présenter de façon claire et précise les solutions que vous aurez sélectionner pour réaliser le projet. Vous devez faire un effort de mise en perspectives afin d'argumenter vos choix et il vous est conseiller de présenter des comparatifs afin de valoriser les solutions que vous aurez sélectionner. Le travail à fournir pour ce document est les plus important, l'évaluation de votre travail sera principalement basée sur ce document.

### Schema fonctionnel A4 (obligatoire)

Le schema fonctionnel est une aide à la lecture de votre document fonctionnel, il ne sagit pas de créaliser une data visualisation compliquée mais vous devez respecter le format A4 pour ce schema. Vous devez y faire figurer toute le logique de stockage, de distribution et de résilience à la panne de votre application.

### Dévelopement (recommandé)

La partie développement est considérée comme une preuve de concept et doit être cohérente et démonstrative par rapport à la présentation.

### Contexte Client

Pour une organisation (CNRS) à destination de 50 chercheurs avec une prévision de 12 nouvelles cartes par an, sur 5 ans. Nombre d'annotations approximatif: 100 annotations par cartes.
Taille des fichiers LIDAR, non compressés 1Gb / approx (les fichiers générés font à peu prêt 12% de la taille d'origine).
A la fin de la première année 2 nouvelles organisations d'autres pays voudront utiliser le même systeme et partager des annotations.


### Livrables:

Dans un répertoire compressé:

- Un README.md (qui explique comment installer et utiliser, ce qui a été réalisé ou non)
- Un document qui décrit comment les 12 critères ont été abordés pour le projet `docs/criteres.md`
- Un document technique (markdown) `docs/architecture.md`
- Un schema fonctionnel (image pdf format a3 paysage `docs/schema.pdf`)
- Un `docker-compose.yml` (qu'on ai plus qu'à faire `docker-compose up`)
- Le code source de l'application
