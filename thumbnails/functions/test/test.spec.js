// You can run these unit tests by running "npm run testWithJest" inside the thumbnails/functions directory.

// NOTE: @google-cloud/storage is auto-mocked via manual mock file

// Mock child-process-promise spawn
const cpp = require("child-process-promise");

cpp.spawn = jest.fn((path, object) => {
  console.log("Inside child-process-promise.spawn", path);
  return Promise.resolve();
});

const fs = require("fs");
jest.mock("fs");

const test = require("firebase-functions-test")();

const myFunctions = require("../index");

let storageObjectEvent = null;

describe("Short circuit thumbnail generation", () => {
  beforeAll(() => {
    global.origConsole = global.console;
  });
  beforeEach(() => {
    global.console = {
      log: jest.fn((msg, arg) => {
        global.origConsole.log(msg, arg);
      })
    };
    storageObjectEvent = {
      data: {
        contentType: "image/jpeg",
        mediaLink: "",
        name: "/some/path/to/an/existingimage.jpg",
        resourceState: "exists",
        metageneration: 1
      }
    };
  });
  afterAll(() => {
    global.console = global.origConsole;
  });

  it("Shouldn't try to convert non-images", async () => {
    storageObjectEvent.data.contentType = "someNonImageType";
    await myFunctions.generateThumbnail(storageObjectEvent);
    // This is actually a horrible test because it tests the specific implementation
    // instead of the output. But the function wasn't written with testability in mind
    // so this is here as a demonstration of how mocks work rather than an example of
    // a good test ;)
    expect(global.console.log.mock.calls.length).toBe(1);
    expect(global.console.log.mock.calls[0][0]).toBe("This is not an image.");
  });

  it("Shouldn't try to convert a thumbnail", async () => {
    storageObjectEvent.data.name = "/some/path/to/an/thumb_existingimage.jpg";
    await myFunctions.generateThumbnail(storageObjectEvent);
    // This is actually a horrible test because it tests the specific implementation
    // instead of the output. But the function wasn't written with testability in mind
    // so this is here as a demonstration of how mocks work rather than an example of
    // a good test ;)
    expect(global.console.log.mock.calls.length).toBe(1);
    expect(global.console.log.mock.calls[0][0]).toBe("Already a Thumbnail.");
  });
});

describe("Successful thumbnail generation", () => {
  beforeAll(() => {
    global.origConsole = global.console;
  });
  beforeEach(() => {
    global.console = {
      log: jest.fn((msg, arg) => {
        global.origConsole.log(msg, arg);
      })
    };
    storageObjectEvent = {
      data: {
        contentType: "image/jpeg",
        mediaLink: "",
        name: "/some/path/to/an/existingimage.jpg"
      }
    };
  });
  afterAll(() => {
    global.console = global.origConsole;
  });

  it("Should convert a thumbnail", async () => {
    await myFunctions.generateThumbnail(storageObjectEvent);
    // This is actually a horrible test because it tests the specific implementation
    // instead of the output. But the function wasn't written with testability in mind
    // so this is here as a demonstration of how mocks work rather than an example of
    // a good test ;)
    expect(global.console.log.mock.calls.length).toBe(3);
    expect(global.console.log.mock.calls[0][1]).toBe("/tmp/existingimage.jpg");
    expect(global.console.log.mock.calls[2][0]).toBe("Thumbnail created at");
  });
});
