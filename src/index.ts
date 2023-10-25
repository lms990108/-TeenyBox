import express, { Request, Response } from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 5001;
const mongoURI = process.env.MONGO_DB_PATH;

mongoose
  .connect(mongoURI as string)
  .then(() => console.log("mongoose connected"))
  .catch((err) => console.error("DB connection fail", err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello world!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
