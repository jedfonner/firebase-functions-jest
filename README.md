# firebase-functions-jest

[![Build Status](https://travis-ci.org/jedfonner/firebase-functions-jest.svg?branch=master)](https://travis-ci.org/jedfonner/firebase-functions-jest)

Demonstrates how to write unit tests in Jest for Firebase Cloud Functions

NOTE: Now updated to work with Firebase Functions v2!

## Why

The Firebase Cloud Functions [Unit Testing documentation](https://firebase.google.com/docs/functions/unit-testing) and [quickstart samples](https://github.com/firebase/functions-samples/tree/master/quickstarts) only describe how to write unit tests using Mocha with Sinon and Chai.

I prefer to use [Jest](https://facebook.github.io/jest/) for unit tests. For all others who feel the same, I wanted to share my code that replicates the Mocha tests in Jest.

## What

5 different quickstarts showing how to mock and test various aspects of Firebase Cloud Functions.

- email-users
- pubsub-helloworld
- thumbnails
- time-server
- uppercase

(Google recently added 2 new quickstarts which I hope to add here soon as well)

What's new in each quickstart project (all interesting code is in the `functions` folder of each project):

- `test/test.spec.js` is the new Jest test
- `package.json` contains a **new** `testWithJest` script which will run the Jest test (in addition to the new dev dependencies)

I also threw in some eslint for fun. After Firebase Functions v1 was released, Google also saw the light and added their own eslint configurations for Firebase Functions v2. For this repo, I have not updated from my earlier eslint to the configuration Google now uses. I also haven't updated all the package scripts to match exactly what Google now ships in v2. Sorry for any confusion!
