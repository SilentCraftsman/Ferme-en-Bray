// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: "mon-site-de-volailles",
      script: "./server.js",
      env: {
        NODE_ENV: "production",
        STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
        BASE_URL: process.env.BASE_URL,
        MONGO_URI: process.env.MONGO_URI,
      },
    },
  ],
};
