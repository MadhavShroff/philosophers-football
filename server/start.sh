cd /home/ubuntu/philosophers-football

git pull; npm install; npm run build;

pm2 stop server/index.js; # stop server if running

pm2 start server/index.js --name "pf-server"; # start server