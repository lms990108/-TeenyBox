import express from "express";
import asyncHandler from "../common/utils/asyncHandler";
import promotionController from "../controllers/promotionController";
import { validationMiddleware } from "../middlewares/validationMiddleware";
import { uploadLocal } from "../middlewares/localMiddleware";
import * as promotionDto from "../dtos/promotionDto";
import { authenticateUser } from "../middlewares/authUserMiddlewares";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.post(
  "/add_promotion",
  authenticateUser,
  upload.single("promotion_poster"),
  validationMiddleware(promotionDto.CreatePromotionDTO),
  asyncHandler(promotionController.createPromotion),
);

router.put(
  "/update_promotion/:promotionNumber",
  uploadLocal.single("promotion_poster"),
  validationMiddleware(promotionDto.UpdatePromotionDTO),
  asyncHandler(promotionController.updatePromotion),
);

router.get("/", asyncHandler(promotionController.getAllPromotions));

router.get(
  "/number/:promotionNumber",
  asyncHandler(promotionController.getPromotionByNumber),
);
router.get(
  "/user/:userId",
  asyncHandler(promotionController.getPromotionsByUserId),
);

router.delete(
  "/delete_promotion/:promotionNumber",
  asyncHandler(promotionController.deletePromotionByNumber),
);

export default router;

/**
 * @swagger
 * tags:
 *   name: Promotion
 *
 * /promotions/add_promotion:
 *   post:
 *     tags:
 *       - Promotion
 *     summary: 새로운 프로모션 추가
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 maxLength: 30
 *                 description: 프로모션의 제목
 *               content:
 *                 type: string
 *                 description: 프로모션의 내용
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: 프로모션에 사용될 태그 배열
 *               promotion_poster:
 *                 type: string
 *                 format: binary
 *                 description: 프로모션의 포스터 이미지 파일
 *     responses:
 *       201:
 *         description: 프로모션이 성공적으로 추가됨
 *       400:
 *         description: 잘못된 요청 데이터
 *
 * /promotions/update_promotion/{promotionNumber}:
 *   put:
 *     tags:
 *       - Promotion
 *     summary: 주어진 번호의 프로모션 업데이트
 *     parameters:
 *       - in: path
 *         name: promotionNumber
 *         required: true
 *         schema:
 *           type: number
 *           description: 업데이트할 프로모션의 번호
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 maxLength: 30
 *                 description: 업데이트된 프로모션의 제목
 *               content:
 *                 type: string
 *                 description: 업데이트된 프로모션의 내용
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: 업데이트된 프로모션의 태그들
 *               promotion_poster:
 *                 type: string
 *                 format: binary
 *                 description: 업데이트될 프로모션의 포스터 이미지 파일 (수정 시 변경 가능)
 *     responses:
 *       200:
 *         description: 프로모션이 성공적으로 업데이트됨
 *       400:
 *         description: 잘못된 요청 데이터
 *       404:
 *         description: 프로모션을 찾을 수 없음
 *
 * /promotions:
 *   get:
 *     tags:
 *       - Promotion
 *     summary: 모든 프로모션 조회
 *     responses:
 *       200:
 *         description: 프로모션 목록 반환
 *         content:
 *           application/json:
 *             examples:
 *               success:
 *                 value:
 *                   - promotion_number: 1
 *                     title: "프로모션 제목"
 *                     content: "프로모션 내용"
 *                     poster_image: "/path/to/image.jpg"
 *                     tags: ["태그1", "태그2"]
 *                     createdAt: "2023-01-01T00:00:00.000Z"
 *                     updatedAt: "2023-01-01T00:00:00.000Z"
 *       404:
 *         description: 프로모션을 찾을 수 없음
 *
 * /promotions/number/{promotionNumber}:
 *   get:
 *     tags:
 *       - Promotion
 *     summary: 특정 번호의 프로모션 조회
 *     parameters:
 *       - in: path
 *         name: promotionNumber
 *         required: true
 *         schema:
 *           type: number
 *           description: 조회할 프로모션의 번호
 *     responses:
 *       200:
 *         description: 특정 프로모션 반환
 *         content:
 *           application/json:
 *             examples:
 *               success:
 *                 value:
 *                   promotion_number: 2
 *                   title: "특정 프로모션 제목"
 *                   content: "특정 프로모션 내용"
 *                   poster_image: "/path/to/image2.jpg"
 *                   tags: ["태그A", "태그B"]
 *                   createdAt: "2023-02-01T00:00:00.000Z"
 *                   updatedAt: "2023-02-01T00:00:00.000Z"
 *       404:
 *         description: 프로모션을 찾을 수 없음
 *
 * /promotions/user/{userId}:
 *   get:
 *     tags:
 *       - Promotion
 *     summary: 특정 사용자의 모든 프로모션 조회
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           description: 조회할 사용자의 ID
 *     responses:
 *       200:
 *         description: 사용자의 프로모션 목록 반환
 *         content:
 *           application/json:
 *             examples:
 *               success:
 *                 value:
 *                   - promotion_number: 3
 *                     title: "사용자 관련 프로모션 제목"
 *                     content: "사용자 관련 프로모션 내용"
 *                     poster_image: "/path/to/user_image.jpg"
 *                     tags: ["태그X", "태그Y"]
 *                     createdAt: "2023-03-01T00:00:00.000Z"
 *                     updatedAt: "2023-03-01T00:00:00.000Z"
 *       404:
 *         description: 사용자를 찾을 수 없음
 *
 * /promotions/delete_promotion/{promotionNumber}:
 *   delete:
 *     tags:
 *       - Promotion
 *     summary: 특정 번호의 프로모션 삭제
 *     parameters:
 *       - in: path
 *         name: promotionNumber
 *         required: true
 *         schema:
 *           type: number
 *           description: 삭제할 프로모션의 번호
 *     responses:
 *       200:
 *         description: 프로모션이 성공적으로 삭제됨
 *       404:
 *         description: 프로모션을 찾을 수 없음
 */
