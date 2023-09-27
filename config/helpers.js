// Helper function to parse time string and return an object with hour and minute as integers
function parseTimeString(timeString) {
    const [hours, minutes] = timeString.split(':');
    return {
      hour: parseInt(hours, 10),
      minute: parseInt(minutes, 10),
    };
  }

module.exports = {parseTimeString}