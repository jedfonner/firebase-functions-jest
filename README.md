# firebase-functions-jest
Demonstrates how to write unit tests in Jest for Firebase Cloud Functions 

## Why
The Firebase Cloud Functions [documentation](https://firebase.google.com/docs/functions/unit-testing) and [quickstart samples](https://github.com/firebase/functions-samples/tree/master/quickstarts) only describe how to write unit tests using Mocha (with Sinon and Chai).

I prefer to use [Jest](https://facebook.github.io/jest/) for unit tests.  For all others who feel the same, I wanted to share my code that replicates the Mocha tests in Jest.

## What
5 different quickstarts showing how to mock and test various aspects of Firebase Cloud Functions.
* email-users
* pubsub-hellowworld
* thumbnails
* time-server
* uppercase - HTTP triggers and Database triggers

What's new in each quickstart project (all interesting code is in the `functions` folder of each project):
* `test/test.spec.js` is the new Jest test
* `package.json` contains a **new** `testWithJest` script which will run the Jest test


I also threw in some eslint for fun.
