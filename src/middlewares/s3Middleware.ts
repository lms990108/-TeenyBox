import multer from "multer";
import multerS3 from "multer-s3";
import { s3 } from "../config/s3config";

const upload = multer({
  storage: multerS3({
    s3,
    bucket: "elice-shopping",
    key(req, file, cb) {
      cb(null, `${file.originalname}`);
    },
  }),
});

module.exports = { upload };
