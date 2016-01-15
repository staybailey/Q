var twilio = require('twilio');
var client = twilio(accountSid, authToken);
var cronJob = require('cron').CronJob;

var accountSid = 'AC46011ec72a62a1ebde2e38ee25456ffe';
var authToken = '1c86a89a3a5b006208a9e09268dc486b';
var sendingNumber = '+15005550006';


function sendInvite (to, url, cb) {
  var to = typeof to === 'object' ? to.body.number : to;
  var url = typeof to === 'object' ? to.body.url : url;
  client.messages.create({
    body: "You've been invited to modify the playlist at this event, using the following link: " + url,
    to: to,
    from: sendingNumber
//  mediaUrl: imageUrl
  }, function(err, data) {
    if (err) {
      console.error('SMS not sent');
      console.error(err);
    } else {
      console.log('SMS sent to ' + data.to);
      if (cb) {
        cb(data.to);
      }
    }
  });
};

function translateTime (startTime, TMinusMinutes) {

}

function createReminder (event) {
  var newTextJob = new cronJob('0 ' + translateTime(event.startTime, event.tMinusMinutes) + ' 0', function () {
    for (var i = 0; i < event.guests.length; i++) {
      sendInvite(event.guests[i], event.url);
    }
  }, null, true);
  return newTextJob;
}


var numbersToCall = ['+14156528632', '+16507555705'];

var textJob = new cronJob('0 0 0 * * *', function () {
  console.log('CRON has automatically generated this at ' + new Date());
  for (var i = 0; i < numbersToCall.length; i++) {
    sendInvite(numbersToCall[i], 'http://www.google.com');
  }
}, null, true);

module.exports = {
  sendInvite: sendInvite
};
