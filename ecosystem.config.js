module.exports = {
  apps : [{
    script: 'server/index.js',
    watch: '/home/ubuntu/philosophers-football',
    name: 'pf-server',
    instances: 1,
    watch: true,
    maxMemoryRestart: '2G',
    max_restarts: 20,
    env: {
      NODE_ENV: 'development',
      SERVER_PORT: 8080,
      CLIENT_PORT: 3000,
    },
    env_production: {
      NODE_ENV: 'production',
      SERVER_PORT: 8080,
      CLIENT_PORT: 3000,
    }
  }],

  deploy : {
    production : {
      user : 'ubuntu',
      host : '44.204.59.3',
      ref  : 'origin/master',
      repo : 'git+https://github.com/MadhavShroff/philosophers-football.git',
      path : 'production/',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
