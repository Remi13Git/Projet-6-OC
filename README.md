# Monde De Dev

## Prérequis

- [Java 23](https://openjdk.java.net/)
- [Node.js et npm](https://nodejs.org/en/download/)
- [MySQL](https://dev.mysql.com/downloads/installer/)
- [Angular CLI 14](https://angular.io/cli)

## Importation du projet

1. Clonez le repository du projet.

    ```bash
    git clone https://github.com/Remi13Git/Projet-6-OC.git
    ```

2. Importez le projet dans votre IDE préféré (par exemple, IntelliJ IDEA ou Eclipse) en tant que projet Maven.

3. Configurer le fichier `application.properties` pour la connexion à la base de données

Pour créer votre base de données MySQL, utilisez le schema présent dans `ressources/sql/script.sql`

Dans le fichier `src/main/resources/application.properties`, vous devez configurer la connexion à votre base de données MySQL en remplaçant l'url, l'username et le password par vos propres données. 


## Installer les dépendances

Dans le terminal de votre IDE, exécutez la commande suivante pour télécharger et installer toutes les dépendances nécessaires à l'exécution du backend :

```bash
cd back
mvn clean install
```

Ouvrez une nouvelle fenetre de votre IDE puis exécutez la commande suivante pour télécharger et installer toutes les dépendances nécessaires à l'exécution du frontend :

```bash
cd front
npm install
```

## Lancer l'application

Une fois les dépendances installées, vous pouvez démarrer le backend avec la commande suivante :

```bash
mvn spring-boot:run
```


Afin de démarrer le frontend, retournez sur votre fenetre Front et lancez le serveur avec la commande suivante : 

```bash
npm run start
```

Votre application sera accessible à l'adresse suivante :

```bash
http://localhost:4200
```
