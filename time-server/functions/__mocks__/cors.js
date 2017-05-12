/**
 * Mock implementation of CORS for testing
 * Since we're just testing the underlying business logic, this
 * doesn't need ot do anything but invoke the callback function argument
 */
function mockCors(config) {
  function cors(req, res, cb) {
    cb();
  }
  return cors;
}

module.exports = mockCors;
