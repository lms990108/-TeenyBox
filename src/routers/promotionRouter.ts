import express from "express";
import asyncHandler from "../common/utils/asyncHandler";
import promotionController from "../controllers/promotionController";
import { validationMiddleware } from "../middlewares/validationMiddleware";
import { uploadLocal } from "../middlewares/localMiddleware";
import * as promotionDto from "../dtos/promotionDto";

const router = express.Router();

// /add_promotion 라우트의 Swagger 주석
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
 *             $ref: '#/components/schemas/CreatePromotionDTO'
 *     responses:
 *       201:
 *         description: 프로모션이 성공적으로 추가됨.
 *         content:
 *           application/json:
 *             examples:
 *               success:
 *                 value:
 *                   message: "프로모션 추가 성공"
 *                   data:
 *                     promotion_number: 1
 *                     title: "흥미로운 프로모션 제목"
 *                     content: "프로모션 내용입니다..."
 *                     poster_image: "/path/to/image.jpg"
 *                     tags: ["태그1", "태그2"]
 *                     createdAt: "2023-01-01T00:00:00.000Z"
 *                     updatedAt: "2023-01-01T00:00:00.000Z"
 *               error:
 *                 value:
 *                   message: "잘못된 데이터 형식"
 *       400:
 *         description: 잘못된 요청 데이터.
 */
router.post(
  "/add_promotion",
  uploadLocal.single("promotion_poster"),
  validationMiddleware(promotionDto.CreatePromotionDTO),
  asyncHandler(promotionController.createPromotion),
);

// /update_promotion/{promotionNumber} 라우트의 Swagger 주석
/**
 * @swagger
 * /update_promotion/{promotionNumber}:
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
 *             $ref: '#/components/schemas/UpdatePromotionDTO'
 *     responses:
 *       200:
 *         description: 프로모션이 성공적으로 업데이트됨.
 *         content:
 *           application/json:
 *             examples:
 *               success:
 *                 value:
 *                   message: "프로모션 업데이트 성공"
 *                   data:
 *                     promotion_number: 2
 *                     title: "업데이트된 프로모션 제목"
 *                     content: "업데이트된 프로모션 내용입니다..."
 *                     poster_image: "/path/to/updated_image.jpg"
 *                     tags: ["태그1", "태그2"]
 *                     createdAt: "2023-01-01T00:00:00.000Z"
 *                     updatedAt: "2023-01-01T00:00:00.000Z"
 *               error:
 *                 value:
 *                   message: "프로모션 번호가 유효하지 않음"
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

// /promotions 라우트의 Swagger 주석
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
 *         content:
 *           application/json:
 *             examples:
 *               success:
 *                 value:
 *                   promotions: [
 *                     {
 *                       promotion_number: 3,
 *                       title: "프로모션 제목",
 *                       content: "프로모션 내용...",
 *                       poster_image: "/path/to/image.jpg",
 *                       tags: ["태그1", "태그2"],
 *                       createdAt: "2023-01-01T00:00:00.000Z",
 *                       updatedAt: "2023-01-01T00:00:00.000Z"
 *                     }
 *                   ]
 *       404:
 *         description: 프로모션을 찾을 수 없음.
 */
router.get("/", asyncHandler(promotionController.getAllPromotions));

// /promotions/number/{promotionNumber} 라우트의 Swagger 주석
/**
 * @swagger
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
 *         description: 특정 프로모션 반환.
 *         content:
 *           application/json:
 *             examples:
 *               success:
 *                 value:
 *                   promotion:
 *                     promotion_number: 4
 *                     title: "특정 프로모션 제목"
 *                     content: "특정 프로모션 내용..."
 *                     poster_image: "/path/to/specific_image.jpg"
 *                     tags: ["태그1", "태그2"]
 *                     createdAt: "2023-01-01T00:00:00.000Z"
 *                     updatedAt: "2023-01-01T00:00:00.000Z"
 *       404:
 *         description: 프로모션을 찾을 수 없음.
 *         content:
 *           application/json:
 *             examples:
 *               error:
 *                 value:
 *                   message: "프로모션 번호가 유효하지 않음"
 */
router.get(
  "/number/:promotionNumber",
  asyncHandler(promotionController.getPromotionByNumber),
);

// /promotions/user/{userId} 라우트의 Swagger 주석
/**
 * @swagger
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
 *         description: 사용자의 프로모션 목록 반환.
 *         content:
 *           application/json:
 *             examples:
 *               success:
 *                 value:
 *                   promotions: [
 *                     {
 *                       promotion_number: 5,
 *                       title: "사용자 관련 프로모션 제목",
 *                       content: "사용자 관련 프로모션 내용...",
 *                       poster_image: "/path/to/user_image.jpg",
 *                       tags: ["태그1", "태그2"],
 *                       createdAt: "2023-01-01T00:00:00.000Z",
 *                       updatedAt: "2023-01-01T00:00:00.000Z"
 *                     }
 *                   ]
 *       404:
 *         description: 사용자를 찾을 수 없음.
 */
router.get(
  "/user/:userId",
  asyncHandler(promotionController.getPromotionsByUserId),
);

// /delete_promotion/{promotionNumber} 라우트의 Swagger 주석
/**
 * @swagger
 * /delete_promotion/{promotionNumber}:
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
 *         description: 프로모션이 성공적으로 삭제됨.
 *       404:
 *         description: 프로모션을 찾을 수 없음.
 */
router.delete(
  "/delete_promotion/:promotionNumber",
  asyncHandler(promotionController.deletePromotionByNumber),
);

export default router;
