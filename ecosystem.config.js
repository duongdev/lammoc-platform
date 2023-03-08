module.exports = {
  apps: [
    {
      name: 'sapo-sync',
      script: 'yarn',
      args: 'sync-sapo-db',
      autorestart: true,
      env: {
        TRANSACTION_SIZE: 250,
      },
    },
    {
      name: 'web',
      script: 'yarn',
      args: 'start',
      autorestart: true,
      env: {
        NODE_ENV: 'production',
        PORT: 80,
      },
    },
  ],
}
