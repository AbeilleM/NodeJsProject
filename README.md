# Présentation du projet

Dans le cadre de mes études, j'ai réalisé ce projet permettant de gérer une bibliothèques de films et ses utilisateurs.

## Récupération du projet

Tout d'abord, je vais vous indiquer comment récupérer le projet, l'instancier et le démarrer pour pouvoir l'utiliser.

Nous allons commencer par cloner ce dépôt git dans un terminal grâce à cette commande :

`git clone https://github.com/Tartef/Node_project.git`

Puis, après avoir ouvert un terminal dans le dossier iut-project, il faut installer les dépendances permettant le bon fonctionnement du projet avec cette commande :

`npm install`

Il faut ensuite créer le fichier .env dans le dossier /server, qui suivra le model du .env-keep, en configurant ses variables d'environnements. Elles ont été basées sur la configuration de base pour la base de données lors du suivi des TPs Objection et Schwifty.

```
  DB_HOST=127.0.0.1
  DB_USER=root
  DB_PASSWORD=hapi
  DB_DATABASE=user
  CRYPT_KEY=uwu (ou autre type de clé)
```

Pour pouvoir démarrer le projet, il va falloir créer le conteneur permettant d'avoir une base de données grâce au service Docker. La commande suivante permet de créer un conteneur MySQL en suivant les variables d'environnements précédantes :

`docker run --name hapi-mysql -e MYSQL_ROOT_PASSWORD=hapi -e MYSQL_DATABASE=user -p 3307:3306 -d mysql:8`

Enfin, nous pouvons lancer le serveur Node Js en tapant la commande suivante dans le terminale :

`npm start`

Nous pouvons enfin accéder au projet grâce à ce lien : [http://localhost:3000/documentation].

## Les fonctionnalités

Ce projet permet d'une part de gérer les utilisateurs. Pour la partie public, on peut :
- Créer de nouveaux utilisateurs
- Se connecter grâce à un mot de passe et un token

Lorsque l'on est connecté avec le role de user, on peut :
- Consulter la liste des utilisateurs
- Consulter la liste des films

Lorsque l'on est connecté avec le role d'admin, on peut :
- Modifier des utilisateurs ou des films
- Supprimer des utilisateurs ou des films
- Ajouter des films
- Donner un rôle d'amin à un utilisateur
- Donner un rôle de user à un utilisateur

