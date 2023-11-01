import { createLogger, format, transports } from "winston";

interface TransformableInfo {
  level: string;
  message: string;
  timestamp?: string;
  errorCode?: number;
  [key: string]: unknown;
}

const logger = createLogger({
  level: "info",
  format: format.json(),
  transports: [
    // Save error logs to error.log file
    new transports.File({
      filename: "logs/error.log",
      level: "error",
      format: format.combine(format.timestamp(), format.json()),
    }),
    // Save combined logs to combined.log file
    new transports.File({
      filename: "logs/combined.log",
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
