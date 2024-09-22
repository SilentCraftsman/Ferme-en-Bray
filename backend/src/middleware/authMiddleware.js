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
      const authKey = decryptedString.slice(0, AUTH_KEY.length);
      const timestamp = parseInt(decryptedString.slice(AUTH_KEY.length), 10);

      if (authKey === AUTH_KEY) {
        const currentTime = Date.now();
        const timeDifference = (currentTime - timestamp) / 1000; // in seconds
        if (timeDifference >= 0 && timeDifference <= 60) {
          next();
        } else {
          res.status(403).json({ message: 'Forbidden: Auth key expired' });
        }
      } else {
        res.status(403).json({ message: 'Forbidden: Invalid auth key' });
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
