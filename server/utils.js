var roomSignature = 'jhbb';

module.exports = {

  getRoomSignature: function () {
    return roomSignature;
  },

  // A sockets room object should have the default value (the socket itself) and the room value which will have the roomSignature
  getSocketRoom: function (roomsObj) {
    for (var key in roomsObj) {
      if (typeof roomsObj[key] === 'string' && roomsObj[key].substr(0, 4) === roomSignature) {
        return roomsObj[key];
      }
    }
  }
}
