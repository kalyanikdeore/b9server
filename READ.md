# BackEnd

- This Repository Includes Day to Day Learnings of BackEnd Technologies :-

- Nodejs
- ExpressJs
- MongoDB
- Docker

# Concepts :

- Modules Content RoadMap :

- 1 : Modules System, FS, REPL, NPM, Package.json , Event Emitter
- 2 : Web Server using Node JS
- 3 : Express JS
- 4 : REST APIs and CRUD
- 5 : Model View Controller (MVC) and File structure
- 6 : Mongo DB basics, Mongo Atlas
- 7 : Mongoose, Schema, Model and CRUD operations
- 8 : MERN - Connecting API with React
- 9 : Deploying MERN app on live cloud server
- 10 : Server Side Rendering - with EJS
- 11: Authentication using JWT
- 12 : Events, Streams, Sockets - socket.io

## Backend SETUP :

- mkdir cms-server
- cd cms-server

  bash command :

        npm init --> creates package.json

        npm init -y --> creates package.json

- npm means Node package manager
- init means initialization
- so we initialize our package.json file
- this file is used to store all the dependencies required for our server

create app folder

        - create index.js               --> main source file for server

        - create config                 --> folder for configuration
        - create utils                  --> folder for utility functions

        - create models                 --> folder for database models
        - create controllers            --> folder for business logic
        - create routes                 --> folder for routes
        - create middleware             --> folder for middleware

Express Framework

    link for documentation of express ->    https://expressjs.com/

        - npm i express
    express dependencies added to package.json

express is a minimal and flexible Node.js web application framework that provides a robust set of features for

Server Defining :

        const express = require('express')
        const app = express()
        const port = 3000

        app.get('/', (req, res) => {
        res.send('Hello World!')
        })

        app.listen(port, () => {
        console.log(Example app listening on port ${port})
        })

for continupus live changes we use nodemon library

    - npm i nodemon

        npm i dotenv

Now Database Setup :

- require("dotenv").config(); // module dotenv import

           module.exports = {
       HOST: process.env.DB_HOST,
       USER: process.env.DB_USER,
       PASSWORD: process.env.DB_PASSWORD,
       DB: process.env.DB_NAME,
       PORT: process.env.DB_PORT,
       dialect: "postgres",
       pool: {
           max: 5,
           min: 0,
           acquire: 30000,
           idle: 10000,
       },
       //   ssl: true,
       };

       we use dotenv to keep our credential hidden

we use sequelize to connect to database

- npm i sequelize
  https://sequelize.org/docs/v6/getting-started/

- npm i pg
- npm i pg-hstore

- create

npm i cors

https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS
