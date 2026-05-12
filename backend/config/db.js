import mongoose from 'mongoose';
import config from './index.js';

const connectDB = async () => {
  const connection = await mongoose.connect(config.mongoUri, {
    autoIndex: config.nodeEnv !== 'production'
  });

  console.log(`MongoDB connected: ${connection.connection.host}`);
};

export default connectDB;
