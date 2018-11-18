// @google-cloud/storage mock needs to be in a separate file because of https://github.com/facebook/jest/issues/553
function bucketFn(bucketName) {
  // console.log(`Jest @google-cloud/storage.bucket called with ${bucketName}`);
  return {
    upload: jest.fn((tempFilePath, config) => {
      // console.log(`Jest @google-cloud/storage.bucket.upload called with ${tempFilePath} and config`, config);
      return Promise.resolve(config.destination);
    }),
    file: jest.fn(name => {
      // console.log(`Jest @google-cloud/storage.bucket.file() called with ${name}`);
      return {
        download: jest.fn(config => {
          // console.log(`Jest @google-cloud/storage.bucket.file().download() called with ${config}`);
          return Promise.resolve();
        })
      };
    })
  };
}

module.exports = options => {
  return {
    bucket: bucketFn
  };
};
