export const API_BASE_PATH = `${process.env.API_BASE_URL || ''}/api`;
export const ENCRYPT_KEY = process.env.ENCRYPT_KEY;
export const AUTH_KEY = process.env.AUTH_KEY;

if (!ENCRYPT_KEY) {
  throw new Error(
    'ENCRYPT_KEY environment variable is not set. Please set it to your desired encryption key.'
  );
}

if (!AUTH_KEY) {
  throw new Error(
    'AUTH_KEY environment variable is not set. Please set it to your desired authentication key.'
  );
}
