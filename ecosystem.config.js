module.exports = {
  apps: [{
    name: 'app',
    script: './app.js',
    env: {
      NODE_ENV: 'development',
      DEBUG: 'app:*',
    },
    env_test: {
      NODE_ENV: 'test',
    },
    env_staging: {
      NODE_ENV: 'staging',
    },
    env_production: {
      NODE_ENV: 'production',
    },
  }],
};

