# hocmeDir="/home/ubuntu/philosophers-football";

# git pull; npm install; npm run build;

/home/ubuntu/.nvm/versions/node/v19.0.1/bin/pm2 stop $homeDir/server/index.js; # stop server if running

/home/ubuntu/.nvm/versions/node/v19.0.1/bin/pm2 start $homeDir/server/index.js --name "pf-server"; # start server