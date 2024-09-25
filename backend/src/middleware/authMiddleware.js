import { AUTH_KEY, ENCRYPT_KEY } from '../config/config.js';
import CryptoJS from 'crypto-js';
import logger from '../config/logger.js';

const pathNotRequiringAuth = ['/api/health'];

export const authMiddleware = (req, res, next) => {
  if (pathNotRequiringAuth.includes(req.path)) {
    next();
    return;
  }

  const authHeader = req.headers['authorization'];

  if (authHeader) {
    try {
      const bytes = CryptoJS.AES.decrypt(authHeader, ENCRYPT_KEY);
      const decryptedString = bytes.toString(CryptoJS.enc.Utf8);

      if (decryptedString !== AUTH_KEY) {
        logger.info(`Request with invalid auth key: ${authHeader}`);
        res.status(403).json({ message: 'Forbidden: Invalid auth key' });
      } else {
        next();
      }
    } catch (error) {
      logger.error('Error in authMiddleware:', error);
      res
        .status(403)
        .json({ message: 'Forbidden: Invalid authorization header' });
    }
  } else {
    res
      .status(403)
      .json({ message: 'Forbidden: Authorization header missing' });
  }
};
