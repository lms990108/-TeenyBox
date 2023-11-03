import fs from "fs";
import path from "path";
import { createLogger, format, transports } from "winston";

interface TransformableInfo {
  level: string;
  message: string;
  timestamp?: string;
  errorCode?: number;
  [key: string]: unknown;
}

// log directory check
const logDir = path.join(__dirname, "../../../logs");

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logger = createLogger({
  level: "info",
  format: format.json(),
  transports: [
    // Save error logs to error.log file
    new transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error",
      format: format.combine(format.timestamp(), format.json()),
    }),
    // Save combined logs to combined.log file
    new transports.File({
      filename: path.join(logDir, "combined.log"),
      format: format.combine(format.timestamp(), format.json()),
    }),
    // Print logs to console
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
