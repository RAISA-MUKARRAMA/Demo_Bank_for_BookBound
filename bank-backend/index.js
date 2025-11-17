const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const transactionRoutes = require('./routes/transactionRoutes');

const app = express();


// Configure CORS
const corsOptions = {
    origin: '*', // Allow all origins (for development). For production, specify your domains
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  };
  app.use(cors(corsOptions));
  
app.use(express.json());

// Routes
app.use('/api/transaction', transactionRoutes);

const mongoURL = `${process.env.MONGO_URL}${process.env.DB_NAME}?retryWrites=true&w=majority`;
// MongoDB connection
mongoose.connect(mongoURL)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

app.listen(process.env.PORT || 6002, () => {
  console.log(`🏦 Bank Server running on port ${process.env.PORT || 6002}`);
});
