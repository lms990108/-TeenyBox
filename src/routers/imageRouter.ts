import express from "express";
import multer from "multer";
import { uploadImage } from "../controllers/imageController";

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.post("/upload", upload.single("image_url"), uploadImage);

export default router;

/**
 * @swagger
 * tags:
 *   - name: Image
 *     description: 이미지 관련 API
 *
 * /images/upload:
 *   post:
 *     tags:
 *       - Image
 *     summary: 이미지 파일 업로드
 *     description: 홍보 게시글의 포스터 이미지를 업로드합니다.
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image_url:
 *                 type: string
 *                 format: binary
 *                 description: 업로드할 이미지 파일
 *     responses:
 *       '201':
 *         description: 이미지 업로드 성공. 업로드된 이미지 URL 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 image_url:
 *                   type: string
 *                   description: 업로드된 이미지의 URL
 *       '400':
 *         description: 파일이 전송되지 않았거나 요청이 잘못됨
 *       '500':
 *         description: 서버 내부 오류로 인한 이미지 업로드 실패
 */
