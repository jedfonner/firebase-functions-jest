// You can run these unit tests by running "npm run testWithJest" inside the time-server/functions directory.
const test = require("firebase-functions-test")();

const myFunctions = require("../index");

jest.mock("cors"); // See manual mock in ../__mocks__/cors.js
require("cors"); // Jest will return the mock not the real module

describe("date", () => {
  it("should return a 403 for PUT calls", done => {
    const mockRequest = {
      method: "PUT"
    };
    const mockResponse = {
      status: code => {
        expect(code).toEqual(403);
        return {
          send: jest.fn(label => {
            expect(label).toBe("Forbidden!");
            done();
          })
        };
      }
    };
    myFunctions.date(mockRequest, mockResponse);
  });

  it("should return a 200 with formatted date when passed date format in query", done => {
    const mockRequest = {
      method: "GET",
      query: {
        format: "MMMM Do YYYY, h:mm:ss a"
      }
    };
    const mockResponse = {
      status: code => {
        expect(code).toEqual(200);
        return {
          send: jest.fn(formattedDate => {
            expect(formattedDate).not.toBeNull();
            done();
          })
        };
      }
    };
    myFunctions.date(mockRequest, mockResponse);
  });

  it("should return a 200 with formatted date when passed date format in body", done => {
    const mockRequest = {
      method: "GET",
      query: {},
      body: {
        format: "MMMM Do YYYY, h:mm:ss a"
      }
    };
    const mockResponse = {
      status: code => {
        expect(code).toEqual(200);
        return {
          send: jest.fn(formattedDate => {
            expect(formattedDate).not.toBeNull();
            done();
          })
        };
      }
    };
    myFunctions.date(mockRequest, mockResponse);
  });
});
