import express from "express";
import asyncHandler from "../common/utils/asyncHandler";
import promotionController from "../controllers/promotionController";
import { validationMiddleware } from "../middlewares/validationMiddleware";
import { uploadLocal } from "../middlewares/localMiddleware";
import * as promotionDto from "../dtos/promotionDto";

const router = express.Router();

/**
 * @swagger
 * /add_promotion:
 *   post:
 *     tags:
 *       - Promotion
 *     summary: 새로운 프로모션 추가
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: 프로모션 제목
 *               content:
 *                 type: string
 *                 description: 프로모션 내용
 *               promotion_poster:
 *                 type: string
 *                 format: binary
 *                 description: 프로모션 포스터 이미지
 *     responses:
 *       201:
 *         description: 프로모션이 성공적으로 추가됨.
 *       400:
 *         description: 잘못된 요청 데이터.
 */
router.post(
  "/add_promotion",
  uploadLocal.single("promotion_poster"),
  validationMiddleware(promotionDto.CreatePromotionDTO),
  asyncHandler(promotionController.createPromotion),
);

/**
 * @swagger
 * /update_promotion/{promotionNumber}:
 *   put:
 *     tags:
 *       - Promotion
 *     summary: 주어진 ID의 프로모션 업데이트
 *     parameters:
 *       - in: path
 *         name: promotionNumber
 *         required: true
 *         schema:
 *           type: number
 *           description: 프로모션 번호
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePromotionDTO'
 *     responses:
 *       200:
 *         description: 프로모션이 성공적으로 업데이트됨.
 *       400:
 *         description: 잘못된 요청 데이터.
 *       404:
 *         description: 프로모션을 찾을 수 없음.
 */
router.put(
  "/update_promotion/:promotionNumber",
  uploadLocal.single("promotion_poster"),
  validationMiddleware(promotionDto.UpdatePromotionDTO),
  asyncHandler(promotionController.updatePromotion),
);

/**
 * @swagger
 * /promotions:
 *   get:
 *     tags:
 *       - Promotion
 *     summary: 모든 프로모션 조회
 *     responses:
 *       200:
 *         description: 프로모션 목록 반환.
 *       404:
 *         description: 프로모션을 찾을 수 없음.
 */
router.get("/", asyncHandler(promotionController.getAllPromotions));

/**
 * @swagger
 * /promotions/number/{promotionNumber}:
 *   get:
 *     tags:
 *       - Promotion
 *     summary: 프로모션 번호로 특정 프로모션 조회
 *     parameters:
 *       - in: path
 *         name: promotionNumber
 *         required: true
 *         schema:
 *           type: number
 *           description: 프로모션 번호
 *     responses:
 *       200:
 *         description: 특정 프로모션 반환.
 *       404:
 *         description: 프로모션을 찾을 수 없음.
 */
router.get(
  "/number/:promotionNumber",
  asyncHandler(promotionController.getPromotionByNumber),
);

/**
 * @swagger
 * /promotions/user/{userId}:
 *   get:
 *     tags:
 *       - Promotion
 *     summary: 사용자 ID로 해당 사용자의 모든 프로모션 조회
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           description: 사용자 ID
 *     responses:
 *       200:
 *         description: 사용자의 프로모션 목록 반환.
 *       404:
 *         description: 사용자를 찾을 수 없음.
 */
router.get(
  "/user/:userId",
  asyncHandler(promotionController.getPromotionsByUserId),
);

/**
 * @swagger
 * /delete_promotion/{promotionNumber}:
 *   delete:
 *     tags:
 *       - Promotion
 *     summary: 프로모션 번호로 특정 프로모션 삭제
 *     parameters:
 *       - in: path
 *         name: promotionNumber
 *         required: true
 *         schema:
 *           type: number
 *           description: 프로모션 번호
 *     responses:
 *       200:
 *         description: 프로모션이 성공적으로 삭제됨.
 *       404:
 *         description: 프로모션을 찾을 수 없음.
 */
router.delete(
  "/delete_promotion/:promotionNumber",
  asyncHandler(promotionController.deletePromotionByNumber),
);

export default router;
