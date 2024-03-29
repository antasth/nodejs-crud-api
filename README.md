# nodejs-CRUD-API

## CRUD API

This is a simple CRUD API implementation using an in-memory database underneath.

## Technologies

Project is created with:

- Node JS 20 LTS version
- TypeScript
- Ts-node
- Esling
- Prettier
- Jest

## Technical Requirements

Node.js 20 LTS version
TypeScript
Only specific libraries and tools are allowed (nodemon, dotenv, cross-env, typescript, ts-node, ts-node-dev, eslint and its plugins, webpack-cli, webpack and its plugins, prettier, uuid, @types/\*)
Prefer asynchronous API whenever possible

## Implementation Details

# Endpoints

- GET api/users: Get all users.
  Response: Status code 200 and all user records.
  GET api/users/{userId}: Get a user by ID.
  Response: Status code 200 and the record with id === userId if it exists.
  Response: Status code 400 and corresponding message if userId is invalid (not a UUID).
  Response: Status code 404 and corresponding message if the record with id === userId doesn't exist.
- POST api/users: Create a new user record and store it in the database.
  Response: Status code 201 and the newly created record.
  Response: Status code 400 and corresponding message if the request body does not contain required fields.
- PUT api/users/{userId}: Update an existing user.
  Response: Status code 200 and the updated record.
  Response: Status code 400 and corresponding message if userId is invalid (not a UUID).
  Response: Status code 404 and corresponding message if the record with id === userId doesn't exist.
- DELETE api/users/{userId}: Delete an existing user from the database.
  Response: Status code 204 if the record is found and deleted.
  Response: Status code 400 and corresponding message if userId is invalid (not a UUID).
  Response: Status code 404 and corresponding message if the record with id === userId doesn't exist.

# User Object

Users are stored as objects with the following properties:

id: Unique identifier (string, UUID) generated on the server side.
username: User's name (string, required).
age: User's age (number, required).
hobbies: User's hobbies (array of strings or empty array, required).

# Error Handling

Requests to non-existing endpoints is handled with a response of status code 404 and a corresponding human-friendly message.
Errors on the server side is handled and processed correctly, with a response of status code 500 and a corresponding human-friendly message.

# Running the Application

The application can be run in development mode using `npm run start:dev`.
The application can be run in production mode using `npm run start:prod`, which starts the build process and then runs the bundled file.
The value of the port on which the application is running is stored in a .env file.

# Testing

There are 3 test scenarios for the API.

# Horizontal Scaling

The application support horizontal scaling.
The npm run start:multi script starts multiple instances of the application using the Node.js Cluster API.
The number of instances should be equal to the available parallelism minus 1 on the host machine.
Each instance listen on a different port (PORT + n).
A load balancer distribute requests across the instances using the Round-robin algorithm.
Consistency between Workers
The state of the database is consistent between different workers.
For example, if a record is created by one worker, it will be accessible by other workers.
Similarly, if a record is deleted by one worker, it will be considered deleted by other workers.

## Installation

Clone the repository.
Install the dependencies using npm install.
Set the environment variables in the .env file.

## Available Scripts

Run the application in development mode with `npm run start:dev`.
Run the application in production mode with `npm run start:prod`.
Run the Eslint check `npm run lint`.
Run the Prettier `npm run format`.
Run the tests with `npm test`.
