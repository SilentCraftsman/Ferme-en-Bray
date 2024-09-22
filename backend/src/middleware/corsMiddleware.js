import cors from 'cors';
import { CORS_ORIGINS } from '../config/config.js';

const corsOptions = {
  origin: CORS_ORIGINS,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

export const corsMiddleware = cors(corsOptions);
