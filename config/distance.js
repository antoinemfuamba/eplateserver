const moment = require("moment-timezone");

function convertUtcToJohannesburg(utcTime) {
    const utcMoment = moment.utc(utcTime);
    const johannesburgMoment = utcMoment.tz('Africa/Johannesburg');
    return johannesburgMoment.toDate();
  }
  
  module.exports = {
    convertUtcToJohannesburg,
  };  