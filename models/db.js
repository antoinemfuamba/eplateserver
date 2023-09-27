const mongoose = require('mongoose');

const mongoURL = 'mongodb+srv://munekayidev:Mfuamba0511@smartmeter.wbwpdfn.mongodb.net/feedmedb';

mongoose
  .connect(mongoURL, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => {
    console.log('MongoDB Connection Successful');
  })
  .catch((err) => {
    console.error('MongoDB Connection Error:', err);
  });

const db = mongoose.connection;


// Define your schema and models here

// Export the connection
module.exports = db;
