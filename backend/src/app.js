import express from 'express';
import bodyParser from 'body-parser';
import apiRoutes from './routes/apiRoutes.js';
import { corsMiddleware } from './middleware/corsMiddleware.js';
import logger from './config/logger.js';
import { NODE_ENV, PORT } from './config/config.js';
import { authMiddleware } from './middleware/authMiddleware.js';

const app = express();

// check NODE_ENV
if (NODE_ENV === 'production') {
  logger.info('Running in production mode');
} else if (NODE_ENV === 'development') {
  logger.info('Running in development mode');
} else {
  throw new Error('NODE_ENV must be set as either production or development');
}

app.use(corsMiddleware);
app.use(bodyParser.json());

const endpointsToNotLog = ['/health'];

// Log each request and response status code
app.use((req, res, next) => {
  res.on('finish', () => {
    if (endpointsToNotLog.includes(req.path)) {
      return;
    }
    logger.info(`${req.method} ${req.url} - ${res.statusCode}`);
  });
  next();
});

app.use(authMiddleware);

app.use('/api', apiRoutes);

// Error-handling middleware
app.use((err, req, res, next) => {
  logger.error(
    `An error occurred for request ${req.method} ${req.url}: ${err}`
  );
  next(err);
});

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
