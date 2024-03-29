const moment = require("moment-timezone");
const Zone = require('../models/zone');
const Location = require('../models/locations');
const Restaurant = require('../models/restaurants');
const turf = require('@turf/turf');
//const PayFast = require('payfast');

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

// Function to check PayFast payment status
/*async function checkPayFastPaymentStatus(order) {
  try {
    // Retrieve necessary details from the order
    const orderId = order.orderId; // Replace this with the actual field from your order schema
    const amount = order.orderAmount; // Replace this with the actual field from your order schema
    const paymentStatus = order.paymentStatus; // Replace this with the actual field from your order schema

    // Get the PayFast configuration
    const payfastConfig = {
      merchantId: 'YOUR_MERCHANT_ID', // Replace with your PayFast merchant ID
      merchantKey: 'YOUR_MERCHANT_KEY', // Replace with your PayFast merchant key
      passphrase: 'YOUR_PASSPHRASE', // Replace with your PayFast passphrase
      sandbox: true, // Set to false for production
    };

    // Create a PayFast instance with the configuration
    //const payfast = PayFast(payfastConfig);

    // Check if the order payment status is already 'PAID'
    if (paymentStatus === 'PAID') {
      // If already paid, return true
      return true;
    }

    // Use PayFast IPN (Instant Payment Notification) to verify payment status
    const isValid = await payfast.validateIPN({
      payment_id: orderId,
      amount,
    });

    // If PayFast validation is successful, update the order status to 'PAID'
    if (isValid) {
      order.paymentStatus = 'PAID';
      await order.save();
      return true;
    }

    // If validation fails or payment status is not 'PAID', return false
    return false;
  } catch (error) {
    console.error('Error checking PayFast payment status:', error);
    return false;
  }
}
*/

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}
function calculateDistance(lat1, lon1, lat2, lon2) {
  const earthRadiusKm = 6371; // Radius of the Earth in kilometers

  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);

  lat1 = deg2rad(lat1);
  lat2 = deg2rad(lat2);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusKm * c;
}

function isLocationWithinZone(location, zone) {
  const zoneRadiusKm = zone.radius; // The radius of the zone in kilometers

  // Calculate the distance between the location and the center of the zone
  const distance = calculateDistance(
    location.coordinates[1], // Latitude of the location
    location.coordinates[0], // Longitude of the location
    zone.center.coordinates[1], // Latitude of the zone center
    zone.center.coordinates[0] // Longitude of the zone center
  );

  return distance <= zoneRadiusKm;
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
// When a new restaurant is created or coordinates are updated
// This function is triggered

async function assignZoneToRestaurant(restaurantId, coordinates) {
  try {
    // Query the Zone collection to find the corresponding zone
    const zones = await Zone.find();

    for (const zone of zones) {
      if (zone.location) {
        // Fetch the `location` document using the reference
        const location = await Location.findById(zone.location);
        if (!location) {
          console.log('Location document not found for the zone:', zone.title);
          continue;
        }
      // Extract the coordinates from the nested arrays within the location field
      const polygonCoordinates = location.coordinates[0].map((point) => point.reverse()); // Reverse coordinates

              // Reverse the coordinates
      coordinates = [coordinates[1], coordinates[0]];

      // Check if the restaurant's coordinates are within the zone's polygon
      const isInsideZone = isPointInsidePolygon(coordinates, polygonCoordinates);
      if (isInsideZone) {
        // Update the restaurant's zone field
        await Restaurant.findByIdAndUpdate(restaurantId, { zone: zone._id });

        console.log('Zone assigned to the restaurant successfully.');
        return;
      }
    }
  }
    console.log('No matching zone found for the restaurant.');
  } catch (error) {
    console.error('Error assigning zone to restaurant:', error);
  }
}
function isPointInsidePolygon(point, polygon) {
  const x = point[0];
  const y = point[1];
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0];
    const yi = polygon[i][1];
    const xj = polygon[j][0];
    const yj = polygon[j][1];
    const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}
function generateRandomId() {
  // Generate a random number between 100000 and 999999
  return Math.floor(100000 + Math.random() * 900000).toString();
}

  module.exports = {
    convertUtcToJohannesburg,
    getDistanceFromLatLonInMeters,
    generateUniqueCode,
    getRestaurantName,
    fetchRiderLocation, // Include the fetchRiderLocation function
    updateRiderLocation, // Include the updateRiderLocation function
    isLocationWithinZone,
    assignZoneToRestaurant,
    //checkPayFastPaymentStatus,
    generateRandomId
  };  