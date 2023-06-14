module.exports = {
  apps: [
    {
      name: 'sapo-sync',
      script: 'yarn',
      args: 'sync-sapo-db',
      autorestart: false,
      cron_restart: '0 */4 * * *',
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
    {
      name: 'gpt',
      script: 'yarn',
      args: 'openai:gen-prod-description',
      env: {
        THREADS: 1,
      },
    },
  ],
}
