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

// Function to fetch the rider's location
const fetchRiderLocation = async (riderId) => {
  try {
    // Replace this with your actual logic to fetch the rider's location from the database
    // Example: const riderLocation = await RiderLocation.findById(riderId);

    // For demonstration purposes, we'll simulate fetching a random location.
    const latitude = Math.random() * 90; // Random latitude value
    const longitude = Math.random() * 180; // Random longitude value

    return { latitude, longitude };
  } catch (error) {
    console.error(`Failed to fetch rider location: ${error.message}`);
    return null; // Handle errors and return appropriate values
  }
};

// Function to update the rider's location and publish updates
const updateRiderLocation = async (riderId, latitude, longitude, pubsub) => {
  try {
    // Replace this with your actual logic to update the rider's location in the database
    // Example: await RiderLocation.updateOne({ _id: riderId }, { $set: { latitude, longitude } });

    // After updating the location, publish updates to the subscription channel
    pubsub.publish(`RIDER_LOCATION_${riderId}`, {
      subscriptionRiderLocation: {
        _id: riderId,
        location: { latitude, longitude },
      },
    });
  } catch (error) {
    console.error(`Failed to update rider location: ${error.message}`);
    // Handle errors and return appropriate values
  }
};

  module.exports = {
    convertUtcToJohannesburg,
    getDistanceFromLatLonInMeters,
    generateUniqueCode,
    getRestaurantName,
    fetchRiderLocation, // Include the fetchRiderLocation function
    updateRiderLocation, // Include the updateRiderLocation function
  };  