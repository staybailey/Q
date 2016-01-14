// var dotenv = require('dotenv');
var config = {};

// if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
//   dotenv.config({path: '.env'});
// } else {
//   dotenv.config({path: '.env.test', silent: true});
// }

// A random string that will help generate secure one-time passwords and
// HTTP sessions
config.secret = process.env.APP_SECRET || 'keyboard cat';

// Your Twilio account SID and auth token, both found at:
// https://www.twilio.com/user/account
//
// A good practice is to store these string values as system environment
// variables, and load them from there as we are doing below. Alternately,
// you could hard code these values here as strings.

config.accountSid = 'AC46011ec72a62a1ebde2e38ee25456ffe';
config.authToken = '1c86a89a3a5b006208a9e09268dc486b';
config.sendingNumber = '+15005550006';


var requiredConfig = [config.accountSid, config.authToken, config.sendingNumber];
var isConfigured = requiredConfig.every(function(configValue) {
  return configValue || false;
});

if (!isConfigured) {
  var errorMessage =
    'TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_NUMBER must be set.';

  throw new Error(errorMessage);
}

// Export configuration object
module.exports.config = config;



var client = require('twilio')(config.accountSid, config.authToken);

module.exports.sendSms = function(to, message) {
  client.messages.create({
    body: message,
    to: to,
    from: config.sendingNumber
//  mediaUrl: imageUrl
  }, function(err, data) {
    if (err) {
      console.error('SMS not sent');
      console.error(err);
    } else {
      console.log('SMS SENT!');
    }
  });
};

function formatMessage (url) {
  return "You've been invited to modify the playlist at this event, using the following link: " + url;
}

module.exports.sendInvite = function (req, res, next) {
  var messageToSend = formatMessage(req.body.url);
  module.exports.sendSms(req.body.number, messageToSend);
}
