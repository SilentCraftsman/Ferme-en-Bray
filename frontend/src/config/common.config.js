const PRODUCTION = 'production';

export const API_BASE_PATH =
  process.env.NODE_ENV === PRODUCTION ? '/api' : 'http://localhost:3001/api';
