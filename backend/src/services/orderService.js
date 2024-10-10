import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import logger from '../config/logger.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
let client;
let db;

const connectToMongoDB = async () => {
  if (!client) {
    client = new MongoClient(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      logger.info('Connected to MongoDB');
      db = client.db('shop');
    } catch (error) {
      logger.error('Error connecting to MongoDB', error);
      throw error;
    }
  }
  return db;
};

export const getOrdersCollection = async () => {
  if (!db) {
    await connectToMongoDB();
  }
  return db.collection('orders');
};

// Graceful shutdown
process.on('SIGINT', async () => {
  if (client) {
    await client.close();
    logger.info('MongoDB connection closed');
  }
  process.exit(0);
});
