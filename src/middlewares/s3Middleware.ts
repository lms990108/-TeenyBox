import multer from "multer";
import multerS3 from "multer-s3";
import { s3 } from "../config/s3config";

/**
 * @description 이미지 업로드를 위한 multer 미들웨어
 * @example
 * 
itemsRouter.post(
  '/',
  authenticateAdmin,
  upload.fields([{ name: 'image', maxCount: 1 }, { name: 'detail_image[]' }]),
  validateImage,
  async (req, res, next) => {
    const { category, name, price, option, content } = req.body;
    const image = req.files.image[0];
    const detailImages = req.files['detail_image[]'];

    let parsedOption = [];
    if (option) parsedOption = JSON.parse(option);

    try {
      const newItem = await itemService.addItem(category, name, price, parsedOption, content, image, detailImages);
      res.status(201).json({ message: '아이템이 성공적으로 추가되었습니다.', item: newItem });
    } catch (err) {
      next(err);
    }
  },
);
 */
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
