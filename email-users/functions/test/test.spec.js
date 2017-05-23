// You can run these unit tests by running "npm run testWithJest" inside the email-users/functions directory.

// Mock the Firebase configuration
require('firebase-functions').config = jest.fn(() => {
  console.log('Jest firebase functions.config being called');
  return {
    firebase: {
      databaseURL: 'https://not-a-project.firebaseio.com',
      storageBucket: 'not-a-project.appspot.com'
    },
    gmail: {
      email: 'testsender@test.com',
      password: 'testpassword'
    }
  };
});

// Mock nodemailer
const nodemailer = require('nodemailer');

const sendEmailMock = jest.fn(mailOptions => {
  console.log('sendMail mock called with', mailOptions);
  return Promise.resolve();
});
nodemailer.createTransport = jest.fn(address => {
  console.log(`createTransport mock called with ${address}`);
  return {
    sendMail: sendEmailMock
  };
});

const mockEvent = {
  data: {
    email: 'test@test.com',
    displayName: 'Test User'
  }
};

const myFunctions = require('../index');

describe('Sends correct emails', () => {
  beforeEach(() => {
    sendEmailMock.mockClear();
  });
  test('Welcome email', () => {
    myFunctions.sendWelcomeEmail(mockEvent).then(() => {
      expect(sendEmailMock).toHaveBeenCalled();
      const argumentToMock = sendEmailMock.mock.calls[0][0];
      expect(mockEvent.data.email).toEqual(argumentToMock.to);
      expect(argumentToMock.subject).toEqual(expect.stringContaining('Welcome'));
      expect(argumentToMock.text).toEqual(expect.stringContaining(mockEvent.data.displayName));
    });
  });

  test('Goodbye email', () => {
    myFunctions.sendByeEmail(mockEvent).then(() => {
      expect(sendEmailMock).toHaveBeenCalled();
      const argumentToMock = sendEmailMock.mock.calls[0][0];
      expect(mockEvent.data.email).toEqual(argumentToMock.to);
      expect(argumentToMock.subject).toEqual(expect.stringContaining('Bye'));
      expect(argumentToMock.text).toEqual(expect.stringContaining(mockEvent.data.displayName));
    });
  });
});
