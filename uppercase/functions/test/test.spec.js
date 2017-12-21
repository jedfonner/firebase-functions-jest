// You can run these unit tests by running "npm run testWithJest" inside the uppercase/functions directory.

// [START imports and mocks]
const admin = require('firebase-admin');

const functions = require('firebase-functions');

functions.config = jest.fn(() => ({
  firebase: {
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://not-a-project.firebaseio.com',
    storageBucket: 'not-a-project.appspot.com'
  }
}));

const myFunctions = require('../index');

// [END imports and mocks]
// [START tests]
describe('makeUpperCase', () => {
  // This test asserts the business logic (i.e., uppercasing) works correctly
  // It does not test the firebase core functionality (e.g., database writes)
  test('upper cases input and writes it to /uppercase', () => {
    const testInput = 'some value to uppercase';
    const expectedOutput = testInput.toUpperCase();

    // See https://firebase.google.com/docs/functions/unit-testing#invoking_non-https_functions
    const fakeEvent = {
      data: new functions.database.DeltaSnapshot(null, null, null, testInput),
      params: { pushId: 'test' }
    };

    // Create mock that overrides event.data.ref.parent.child().set()
    // The mock will return the ref and value that the calling method wants to write to the database
    const refStub = jest.fn(() => ({
      parent: {
        child: jest.fn(childName => ({
          set: jest.fn(val => Promise.resolve({ ref: childName, val }))
        }))
      }
    }));
    Object.defineProperty(fakeEvent.data, 'ref', { get: refStub });

    const expectedObject = { ref: 'uppercase', val: expectedOutput };
    // Return a promise from the test, and Jest will wait for that promise to resolve.
    // If the promise is rejected, the test will automatically fail
    // See https://facebook.github.io/jest/docs/en/asynchronous.html#promises
    return myFunctions.makeUppercase(fakeEvent).then(result => expect(result).toEqual(expectedObject));
  });
});

describe('addMessage', () => {
  beforeEach(() => {
    // Custom admin database mock for testing the addMessage function
    const refStub = jest.fn(location => ({
      push: jest.fn(data => {
        const mockSnapshot = { ref: location, val: jest.fn(() => data) };
        return Promise.resolve(mockSnapshot);
      })
    }));
    // Code was changed in firebase-admin v0.7.4 to require overriding via the getter
    // The following sinon code in test.js L130-131
    //   databaseStub = sinon.stub(admin, 'database');
    //   databaseStub.get(() => (() => ({ ref: refStub })));
    // is equivalent to the following in Jest:
    Object.defineProperty(admin, 'database', {
      get: () => (() => ({ ref: refStub }))
    });
  });
  // For testing asynchronous code that does not uses promises, use the done callback
  // See https://facebook.github.io/jest/docs/en/asynchronous.html#callbacks
  test('returns a 303 redirect', done => {
    // Use mock requests and mock responses to assert the function works as expected
    const mockRequest = {
      query: {
        text: 'some message'
      }
    };
    const mockResponse = {
      redirect: (code, path) => {
        console.log(`redirect(${code}, ${path}) was called`);
        expect(code).toEqual(303);
        expect(path).toEqual('/messages');
        done();
      }
    };
    myFunctions.addMessage(mockRequest, mockResponse);
  });
});
// [END tests]
