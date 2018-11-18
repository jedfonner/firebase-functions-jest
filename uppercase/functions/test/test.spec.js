// You can run these unit tests by running "npm run testWithJest" inside the uppercase/functions directory.

// [START imports and mocks]

// const admin = jest.genMockFromModule("firebase-admin");
const admin = require("firebase-admin");
admin.initializeApp = jest.fn();

const test = require("firebase-functions-test")();

const myFunctions = require("../index");
// [END imports and mocks]
// [START tests]
describe("makeUpperCase", () => {
  afterEach(() => {
    test.cleanup();
  });
  // This test asserts the business logic (i.e., uppercasing) works correctly
  // It does not test the firebase core functionality (e.g., database writes)
  it("should upper case input and write it to /uppercase", async () => {
    const testInput = "test input";
    const expectedOutput = testInput.toUpperCase();

    const context = {
      params: {
        pushId: "1111"
      }
    };
    const snap = {
      val: () => testInput,
      ref: {
        parent: {
          child: jest.fn(path => {
            expect(path).toEqual("uppercase");
            return {
              set: jest.fn(result => {
                return expect(result).toEqual(expectedOutput);
              })
            };
          })
        }
      }
    };
    const wrapped = test.wrap(myFunctions.makeUppercase);
    const data = await wrapped(snap, context);
  });
});

describe("addMessage", () => {
  let oldDatabase;

  beforeEach(() => {
    oldDatabase = admin.database;
  });

  afterEach(() => {
    admin.database = oldDatabase;
  });

  it("should return a 303 redirect", done => {
    const databaseStub = jest.fn(() => {
      return {
        ref: jest.fn(location => {
          return { push: jest.fn(val => Promise.resolve({ ref: location })) };
        })
      };
    });
    Object.defineProperty(admin, "database", { get: () => databaseStub });

    const mockRequest = {
      query: {
        text: "some message"
      }
    };
    const mockResponse = {
      redirect: (code, path) => {
        console.log(`redirect(${code}, ${path}) was called`);
        expect(code).toEqual(303);
        expect(path).toEqual("/messages");
        done();
      }
    };
    myFunctions.addMessage(mockRequest, mockResponse);
  });
});
// [END tests]
