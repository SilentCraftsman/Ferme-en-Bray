import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import logger from '../config/logger.js';

dotenv.config();

const mongoUri = process.env.MONGODB_URI;
const client = new MongoClient(mongoUri);
export let ordersCollection;

(async () => {
  try {
    await client.connect();
    logger.info('Connected to MongoDB');
    const db = client.db('shop');
    ordersCollection = db.collection('orders');
  } catch (error) {
    console.error('Error connecting to MongoDB', error);
  }
})();
