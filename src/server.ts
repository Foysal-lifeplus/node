import dotenv from 'dotenv';

// Load env vars
dotenv.config();

import app from './app';
import connectDB from './config/db';
import './config/redis';

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(
      `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
    );
  });
});
