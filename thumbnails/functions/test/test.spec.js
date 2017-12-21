// You can run these unit tests by running "npm run testWithJest" inside the thumbnails/functions directory.

// Mock the Firebase configuration
require('firebase-functions').config = jest.fn(() => {
  console.log('Jest firebase functions.config being called');
  return {
    firebase: {
      databaseURL: 'https://not-a-project.firebaseio.com',
      storageBucket: 'not-a-project.appspot.com'
    }
  };
});

// NOTE: @google-cloud/storage is auto-mocked via manual mock file

// Mock child-process-promise spawn
const cpp = require('child-process-promise');

cpp.spawn = jest.fn((path, object) => {
  console.log('Inside child-process-promise.spawn', path);
  return Promise.resolve();
});

const myFunctions = require('../index');

let storageObjectEvent = null;

describe('Short circuit thumbnail generation', () => {
  beforeAll(() => {
    global.origConsole = global.console;
  });
  beforeEach(() => {
    global.console = {
      log: jest.fn(msg => { global.origConsole.log(msg); }),
      warn: jest.fn(msg => { global.origConsole.warn(msg); })
    };
    storageObjectEvent = {
      data: {
        contentType: 'image/jpeg',
        mediaLink: '',
        name: '/some/path/to/an/existingimage.jpg',
        resourceState: 'exists',
        metageneration: 1,
      }
    };
  });
  afterAll(() => {
    global.console = global.origConsole;
  });

  test('Don\'t try to convert non-images', () => {
    storageObjectEvent.data.contentType = 'someNonImageType';
    const thumbnailPromise = myFunctions.generateThumbnail(storageObjectEvent);
    return thumbnailPromise.then(data => {
      expect(data).toBeUndefined();
      expect(console.log).toHaveBeenCalledWith('This is not an image.');
    });
  });

  test('Don\'t try to convert a thumbnail', () => {
    storageObjectEvent.data.name = '/some/path/to/an/thumb_existingimage.jpg';
    const thumbnailPromise = myFunctions.generateThumbnail(storageObjectEvent);
    return thumbnailPromise.then(data => {
      expect(data).toBeUndefined();
      expect(console.log).toHaveBeenCalledWith('Already a Thumbnail.');
    });
  });

  test('Don\'t convert for moves or deletes', () => {
    storageObjectEvent.data.resourceState = 'not_exists';
    const thumbnailPromise = myFunctions.generateThumbnail(storageObjectEvent);
    return thumbnailPromise.then(data => {
      expect(data).toBeUndefined();
      expect(console.log).toHaveBeenCalledWith('This is a deletion event.');
    });
  });

  test('Don\'t convert for metadata changes', () => {
    storageObjectEvent.data.metageneration = 2;
    const thumbnailPromise = myFunctions.generateThumbnail(storageObjectEvent);
    return thumbnailPromise.then(data => {
      expect(data).toBeUndefined();
      expect(console.log).toHaveBeenCalledWith('This is a metadata change event.');
    });
  });
});

describe('Successful thumbnail generation', () => {
  beforeEach(() => {
    storageObjectEvent = {
      data: {
        contentType: 'image/jpeg',
        mediaLink: '',
        name: '/some/path/to/an/existingimage.jpg',
      }
    };
  });
  test('Converts a thumbnail', () => {
    const thumbnailPromise = myFunctions.generateThumbnail(storageObjectEvent);
    return thumbnailPromise.then(data => {
      expect(data).not.toBeNull();
      const thumbFileName = data.split('/').pop();
      expect(thumbFileName).toMatch(/thumb_existingimage/);
    });
  });
});
