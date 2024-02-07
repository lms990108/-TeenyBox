import "reflect-metadata";
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import dotenv from "dotenv";
import logger from "./common/utils/logger";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./config/swagger";

import pingRouter from "./routers/pingRouter";
import postRouter from "./routers/postRouter";
import promotionRouter from "./routers/promotionRouter";
import commentRouter from "./routers/commentRouter";
import showRouter from "./routers/showRouter";
import userRouter from "./routers/userRouter";
import imageRouter from "./routers/imageRouter";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import path from "path";
import cors from "cors";
import reviewRouter from "./routers/reviewRouter";
import presignedUrlRouter from "./routers/presignedUrlRouter";

dotenv.config();

const app = express();
const port: string = process.env.PORT;
const mongoURI: string = process.env.MONGO_DB_PATH;

mongoose
  .connect(mongoURI as string)
  .then(() => logger.info("mongoose connected"))
  .catch((err: Error) => logger.error("DB connection fail", err));

app.use(
  cors({
    origin: ["http://localhost:3000", "https://dailytopia2.shop"],
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// uploads 폴더를 정적 경로로 설정합니다.
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const morganStream = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};

if (process.env.NODE_ENV === "production") {
  app.use(morgan("combined", { stream: morganStream }));
} else {
  app.use(morgan("dev", { stream: morganStream }));
}

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api/ping", pingRouter);
app.use("/api/posts", postRouter);
app.use("/api/promotions", promotionRouter);
app.use("/api/comments", commentRouter);
app.use("/api/shows", showRouter);
app.use("/api/users", userRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/images", imageRouter);
app.use("/api/presigned-urls", presignedUrlRouter);

app.use(errorMiddleware);

app.listen(port, () => {
  logger.info(`server is running on ${port}`);
});
