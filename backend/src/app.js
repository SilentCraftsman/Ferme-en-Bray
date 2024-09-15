import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import apiRoutes from './routes/apiRoutes.js';
import { corsMiddleware } from './config/corsConfig.js';
import logger from './config/logger.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(corsMiddleware);
app.use(bodyParser.json());

// Log each request
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

app.use('/api', apiRoutes);

// Error-handling middleware
app.use((err, req, res, next) => {
  logger.error(
    `An error occurred for request ${req.method} ${req.url}: ${err}`
  );
  next(err);
});

app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});
