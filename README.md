# Webhooks - Backend and Microservice

**Note:** All the code is written in Typescript with Node.js.

This application is consists of two parts-

## Backend

This is made to run on port `4080` by default. To change it modify the `.env` file.

#### The backend dependencies are:

-   Express _(Web framework for Node.js)_
-   Dotenv _(To parse environment files)_
-   Axios _(To make API calls)_
-   Mongoose _(For connecting and using MongoDB as a database)_
-   Rimraf _(To help clean and build project)_
-   Concurrently and Nodemon _(Used to aid faster development)_

#### To run the project:

_(The project was built using Windows so the instructions are Windows specific)_

-   Node.js, npm and MongoDB must be installed to run the project
-   Navigate to the folder and open a terminal
-   Run `npm install`, this shall install all the required packages to run the project
-   After installation is complete run `npm run build`, now the project should complete building
-   Now run `npm start` to run the application
-   To run the project in development mode, use `npm run dev` instead of `npm start`

#### Routes

`POST /users` - To add a new user. Body: `{ username: String, role: ["admin" or "user"] }`<br>
`POST /` - To add a new URL to webhook. Body: `{ username: String, targetURL: String }` [User requires admin role]<br>
`GET /` - To get all webhooks. Body: `{ username: String }` [User requires admin role]<br>
`PUT /` - To update existing webhook. Body: `{ username: String, id: String, newTargetURL: String }` [User requires admin role]<br>
`DELETE /` - To delete existing webhook. Body: `{ username: String, id: String }` [User requires admin role]<br>
`POST /ip` - To initiate webhook.trigger. User IP address sent to microservice.

## Microservice

This is made to run on port `3000` by default. To change it modify the `.env` file.

#### The webhook microservice dependencies are:

-   Moleculer _(Microservices framework for Node.js)_
-   Dotenv _(To parse environment files)_
-   Axios _(To make API calls)_
-   Mongoose _(For connecting and using MongoDB as a database)_
-   Async _(For making asynchronous requests in parallel)_

#### To run the project:

_(The project was built using Windows so the instructions are Windows specific)_

-   Node.js, npm and MongoDB must be installed to run the project
-   Navigate to the folder and open a terminal
-   Run `npm install`, this shall install all the required packages to run the project
-   After installation is complete run `npm run build`, now the project should complete building
-   Now run `npm start` to run the application
-   To run the project in development mode, use `npm run dev` instead of `npm start`

#### Routes

`POST /` - To create a new webhook. Action - `webhook.register`. Params: `targetURL: String`.<br>
`DELETE /` - To delete a webhook. Action - `webhook.delete`. Params: `id: String`.<br>
`GET /` - To get all webhooks. Action - `webhook.list`.<br>
`PUT /` - To update a webhook. Action - `webhook.update`. Params: `id: String, newTargetURL: String`.<br>
`GET /trigger` - To initiate trigger. Action `webhook.trigger`. Params: `ipAddress: String`.

## Testing the apps

For testing the routes I used Postman.  
The Postman collection can be found [here](https://www.getpostman.com/collections/9c8a35386f425fe800bd).

## Notes

-   The application isn't really secure. Even though there are access control levels, it has been implemented using username and there is nothing like a JWT authentication.
-   The `.env` files have been exposed but they don't have any sensitive information.
-   The `webhook.trigger` action outputs the results in a `TriggerOutput.log` file in the `webhook-microservice` directory.
