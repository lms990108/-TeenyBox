import { createLogger, format, transports } from "winston";
import path from "path";
import fs from "fs";

const logDirectory = path.join(__dirname, "logs");

if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

interface TransformableInfo {
  level: string;
  message: string;
  timestamp?: string;
  errorCode?: number;
  [key: string]: unknown;
}

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
  ),
  transports: [
    new transports.File({
      filename: path.join(logDirectory, "batch.log"),
      format: format.combine(format.timestamp(), format.json()),
    }),
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.timestamp(),
        format.printf((info: TransformableInfo) => {
          const { timestamp, level, message, ...args } = info;
          const ts = timestamp.slice(0, 19).replace("T", " ");
          return `${ts} [${level}]: ${message} ${
            Object.keys(args).length ? JSON.stringify(args, null, 2) : ""
          }`;
        }),
      ),
    }),
  ],
});

export default logger;
