import cors from 'cors';

const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://lavolailleenbray.com',
    'https://www.lavolailleenbray.com',
    'https://ferme-en-bray.onrender.com',
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

export const corsMiddleware = cors(corsOptions);
