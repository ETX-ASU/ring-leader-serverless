import winston from "winston";

import {LOGGING_LEVEL} from "./environment"

const MAXIMUM_LOG_FILE_SIZE = 1000000 * 10; // (10mb);


const logger = winston.createLogger({
  level: LOGGING_LEVEL,
  transports: [
    new winston.transports.Console()
  ]
});

export { logger };
