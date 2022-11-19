const morgan = require('morgan');
const { createLogger, transports, format } = require('winston');

const logger = createLogger({
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  silent: false,
  transports: [
    new transports.File({
      filename: './logs/all-logs.log',
      json: false,
      maxsize: 10000000, // ~10 MB
      maxFiles: 5,
    }),
    new transports.Console(),
  ]
});

logger.stream = {
  write: message => logger.info(message.substring(0, message.lastIndexOf('\n')))
};

module.exports = {
  serverLogger: morgan(
    'dev',{ stream: logger.stream}
  ),
  logger
};