module.exports = {
  apps: [
    {
      name: 'sapo-sync',
      script: 'yarn',
      args: 'sync-sapo-db',
      autorestart: false,
      env: {
        TRANSACTION_SIZE: 250,
      },
    },
    {
      name: 'web',
      script: 'yarn',
      args: 'start',
      autorestart: false,
      env: {
        NODE_ENV: 'production',
        PORT: 80,
      },
    },
  ],
}
