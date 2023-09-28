const moment = require("moment-timezone");

function convertUtcToJohannesburg(utcTime) {
    const utcMoment = moment.utc(utcTime);
    const johannesburgMoment = utcMoment.tz('Africa/Johannesburg');
    return johannesburgMoment.toDate();
  }
  // Function to calculate the distance between two points on the Earth's surface using Haversine formula
function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c * 1000; // Distance in meters
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

function generateUniqueCode(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters.charAt(randomIndex);
  }

  return code;
}

async function getRestaurantName(restaurantId) {
  try {
    // Implement your logic to fetch the restaurant name from your data source (e.g., database)
    // Example using Mongoose if you're using MongoDB:
    const restaurant = await Restaurant.findById(restaurantId);
    
    if (!restaurant) {
      throw new Error('Restaurant not found');
    }

    return restaurant.name; // Assuming 'name' is the field containing the restaurant name
  } catch (error) {
    console.error(error);
    throw new Error('Failed to get restaurant name');
  }
}


  module.exports = {
    convertUtcToJohannesburg,
    getDistanceFromLatLonInMeters,
    generateUniqueCode,
    getRestaurantName
  };  