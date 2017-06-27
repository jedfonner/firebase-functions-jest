# firebase-functions-jest
[![Build Status](https://travis-ci.org/jedfonner/firebase-functions-jest.svg?branch=master)](https://travis-ci.org/jedfonner/firebase-functions-jest)

Demonstrates how to write unit tests in Jest for Firebase Cloud Functions

## Why
The Firebase Cloud Functions [Unit Testing documentation](https://firebase.google.com/docs/functions/unit-testing) and [quickstart samples](https://github.com/firebase/functions-samples/tree/master/quickstarts) only describe how to write unit tests using Mocha with Sinon and Chai.

I prefer to use [Jest](https://facebook.github.io/jest/) for unit tests.  For all others who feel the same, I wanted to share my code that replicates the Mocha tests in Jest.

## What
5 different quickstarts showing how to mock and test various aspects of Firebase Cloud Functions.
* email-users
* pubsub-helloworld
* thumbnails
* time-server
* uppercase

What's new in each quickstart project (all interesting code is in the `functions` folder of each project):
* `test/test.spec.js` is the new Jest test
* `package.json` contains a **new** `testWithJest` script which will run the Jest test (in addition to the new dev dependencies)

I also threw in some eslint for fun.
