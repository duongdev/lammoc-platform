const FNM = {
  interpreter: '/run/user/0/fnm_multishells/20485_1683011309582/bin/node',
}

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
        TS_NODE_CWD: '/root/lammoc-platform',
      },
      ...FNM,
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
      ...FNM,
    },
  ],
}
