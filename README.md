# Web app heavy option made with React & Node.js, ES6 and serverside rendering

Followed this tutorial: https://codeburst.io/headache-free-ssr-react-js-node-js-and-es6-app-boilerplate-tutorial-267f7be0b7b5

### Install

* `npm i` - install dependencies (node_modules folder)

### Run in dev

* `npm run build:watch:server` - runs babel to transpile the server from es6 to es5 (watch mode)
* `npm run build:watch:client` - runs webpack to build bundle (watch mode)
* `npm run start:dev` (Bugged) - in parallel shells it calls `build:watch:client` `build:watch:server` and then runs the app in watch mode, using nodemon

### Prod

* `npm run build:server` - runs babel to transpile the server from es6 to es5 
* `npm run build:client` - runs webpack to build bundle
* `npm run build:prod` - builds both client and server
* `npm run start` (Use this to run app) - in parallel shells it calls `build:prod` and then runs the app 
