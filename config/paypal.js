// paypal.js
const axios = require('axios');

const generateAccessToken = async () => {
  try {
    // Your PayPal client ID and secret
    const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;

    const auth = Buffer.from(
      `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`
    ).toString("base64");

    const response = await axios.post("https://api-m.sandbox.paypal.com/v1/oauth2/token", "grant_type=client_credentials", {
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return response.data.access_token;
  } catch (error) {
    console.error("Failed to generate Access Token:", error);
    throw new Error("Failed to generate Access Token");
  }
};

const createPayPalOrder = async (orderAmount) => {
  try {
    const accessToken = await generateAccessToken();

    const response = await axios.post("https://api-m.sandbox.paypal.com/v2/checkout/orders", {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD", // Adjust currency as needed
            value: orderAmount.toFixed(2),
          },
        },
      ],
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    const { id, links } = response.data;

    // Extract the approval URL from the links array
    const approvalUrl = links.find(link => link.rel === 'approve')?.href;

    if (!id || !approvalUrl) {
      console.error("Invalid PayPal order response:", response.data);
      throw new Error("Invalid PayPal order response");
    }

    return {
      orderId: id,          // PayPal order ID
      approvalUrl: approvalUrl,  // PayPal approval URL
    };
  } catch (error) {
    console.error("Failed to create PayPal order:", error.response?.data || error.message);
    throw new Error("Failed to create PayPal order");
  }
};


const capturePayPalOrder = async (orderID) => {
  try {
    const accessToken = await generateAccessToken();

    const captureUrl = `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderID}/capture`;

    // Include payment_source and other necessary parameters
    const captureData = {
      payment_source: {
        type: 'PAYPAL_ACCOUNT' // Adjust this based on your use case
      },
      note_to_payer: 'Thank you for your purchase!',
      final_capture: true
      // You can include other parameters as needed
    };

    const captureResponse = await axios.post(captureUrl, JSON.stringify(captureData), {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log('Capture Response:', captureResponse.data);

    // Check if the capture was successful
    if (captureResponse.data.status === 'COMPLETED') {
      return true; // Capture successful
    } else {
      console.error("Failed to capture PayPal order:", captureResponse.data);
      throw new Error("Failed to capture PayPal order");
    }
  } catch (error) {
    console.error("Failed to capture PayPal order:", error);
    throw new Error("Failed to capture PayPal order");
  }
};


module.exports = {
  capturePayPalOrder,
  createPayPalOrder,
  generateAccessToken
};
