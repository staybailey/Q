var twilio = require('twilio');
// var cronJob = require('cron').CronJob;

var accountSid = 'ACdf0aee07b7a91ff24f1e73bc5ad1d7b9';
var authToken = 'f327394c51d29365bc4ee1bc5a1bfd93';
var sendingNumber = '+16504513081';

var client = twilio(accountSid, authToken);

function sendInvite (to, url, cb) {
  var to = typeof to === 'object' ? to.body.number : to;
  var url = typeof to === 'object' ? to.body.url : url;
  console.log(to);
  console.log(url);
  client.messages.create({
    body: "You've been invited to modify the playlist at this event, using the following link: " + url,
    to: to,
    from: sendingNumber
  }, function(err, data) {
    if (err) {
      console.error('SMS not sent');
      console.error(err);
    } else {
      console.log('SMS sent to ' + data.to);
      if (cb) {
        cb(null, data.to);
      }
    }
  });
};


// function translateTime (startTime, TMinusMinutes) {
//   var string = new Date(startTime).toString();
//   return '' + test.slice(19, 21) + ' ' + test.slice(16, 18) + ' ' + test.slice(8, 10) + ' ' + test.slice(4, 7);
// }

// function createReminder (event) {
//   console.log('This instance is coming from the createReminder function declaration');
//   var newTextJob = new cronJob('0 ' + translateTime(event.startTime, event.tMinusMinutes) + ' 0', function () {
//     for (var i = 0; i < event.guests.length; i++) {
//       sendInvite(event.guests[i], event.url);
//     }
//   }, null, true);
//   return newTextJob;
// }


// var numbersToCall = ['+14156528632', '+16507555705'];

// var textJob = new cronJob('0 0 0 * * *', function () {
//   console.log('CRON has automatically generated this at ' + new Date());
//   for (var i = 0; i < numbersToCall.length; i++) {
//     sendInvite(numbersToCall[i], 'http://www.google.com');
//   }
// }, null, true);

module.exports = {
  sendInvite: sendInvite
};
