projectDir="/home/ubuntu/philosophers-football";

/home/ubuntu/.nvm/versions/node/v19.0.1/bin/pm2 startOrReload ecosystem.config.js $projectDir/server/index.js --name "pf-server"; # start server
