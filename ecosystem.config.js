/**
 * PM2 PROCESS MANAGER CONFIGURATION
 * Queen Stone Production Server Deployment
 */
module.exports = {
  apps: [
    {
      name: 'queen-stone-web',
      script: 'src/server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOST: '0.0.0.0'
      }
    }
  ]
};
