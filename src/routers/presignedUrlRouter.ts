import { Router } from "express";
import asyncHandler from "../common/utils/asyncHandler";
import presignedUrlController from "../controllers/presignedUrlController";

const router = Router();

/**
 * @swagger
 * /presigned-urls:
 *   post:
 *     tags: [Image]
 *     summary: presigned-url
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *            properties:
 *             key:
 *              type: string
 *              description: 파일 이름
 *              example: "테스트1.jpg"
 *     responses:
 *       200:
 *         description: presigned_url은 이미지를 PUT method로 업로드할 url이고, public_url은 이미지 업로드가 성공하고 나서 이미지가 게시될 url입니다
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                presigned_url:
 *                 type: string
 *                 description: presigned-url
 *                 example:
 *                   "https://elice-5th.s3.ap-northeast-2.amazonaws.com/%ED%9A%8C.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAQ7YSZVF46MYRY6BJ%2F20240207%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Date=20240207T064619Z&X-Amz-Expires=600&X-Amz-Signature=ebedeb60468aafa81b2e499c6db51fc717e03b8aac6a30581fa344f9fe6ed690&X-Amz-SignedHeaders=content-length%3Bhost&x-id=PutObject"
 *                public_url:
 *                 type: string
 *                 description: 외부에서 이미지에 접근할 수 있는 public url, <image src>에 들어갈 값이기도 하고, 이미지 업로드에 성공했을 시 DB에 저장하게 될 url
 *                 example:
 *                  "https://elice-5th.s3.ap-northeast-2.amazonaws.com/2024-02-07T07%3A26%3A41.536Z_%ED%9A%8C.jpg"
 */

router.post("/", asyncHandler(presignedUrlController.getPresignedUrl));

export default router;
