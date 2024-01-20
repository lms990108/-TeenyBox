import express from "express";
import asyncHandler from "../common/utils/asyncHandler";
import promotionController from "../controllers/promotionController";
import { validationMiddleware } from "../middlewares/validationMiddleware";
import * as promotionDto from "../dtos/promotionDto";
import { authenticateUser } from "../middlewares/authUserMiddlewares";

const router = express.Router();

// 글 작성
router.post(
  "/",
  authenticateUser,
  validationMiddleware(promotionDto.CreatePromotionDTO),
  asyncHandler(promotionController.createPromotion),
);

// 글 수정
router.put(
  "/:promotionNumber",
  authenticateUser,
  validationMiddleware(promotionDto.UpdatePromotionDTO),
  asyncHandler(promotionController.updatePromotion),
);

// 글 리스트 조회
router.get("/", asyncHandler(promotionController.getAllPromotions));

// 글 상세 조회
router.get(
  "/:promotionNumber",
  asyncHandler(promotionController.getPromotionByNumber),
);

// 작성자로 글 리스트 조회
router.get(
  "/user/:userId",
  asyncHandler(promotionController.getPromotionsByUserId),
);

// 글 삭제
router.delete(
  "/:promotionNumber",
  asyncHandler(promotionController.deletePromotionByNumber),
);

export default router;

/**
 * @swagger
 * tags:
 *   name: Promotion
 *
 * /promotions:
 *   post:
 *     tags:
 *       - Promotion
 *     summary: 새로운 홍보게시글 추가
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 maxLength: 30
 *                 description: 홍보게시글의 제목
 *               content:
 *                 type: string
 *                 description: 홍보게시글의 내용
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: 홍보게시글에 사용될 태그 배열
 *               promotion_poster:
 *                 type: string
 *                 format: url
 *                 description: 홍보게시글의 포스터 이미지 주소
 *     responses:
 *       201:
 *         description: 홍보게시글이 성공적으로 추가됨
 *       400:
 *         description: 잘못된 요청 데이터
 *
 *   get:
 *     tags:
 *       - Promotion
 *     summary: 모든 홍보게시글 조회
 *     responses:
 *       200:
 *         description: 홍보게시글 목록 반환
 *         content:
 *           application/json:
 *             examples:
 *               success:
 *                 value:
 *                   - promotion_number: 1
 *                     title: "홍보게시글 제목"
 *                     content: "홍보게시글 내용"
 *                     poster_image: "/path/to/image.jpg"
 *                     tags: ["태그1", "태그2"]
 *                     createdAt: "2023-01-01T00:00:00.000Z"
 *                     updatedAt: "2023-01-01T00:00:00.000Z"
 *       404:
 *         description: 홍보게시글을 찾을 수 없음
 *
 * /promotions/{promotionNumber}:
 *   put:
 *     tags:
 *       - Promotion
 *     summary: 주어진 번호의 홍보게시글 업데이트
 *     parameters:
 *       - in: path
 *         name: promotionNumber
 *         required: true
 *         schema:
 *           type: number
 *           description: 업데이트할 홍보게시글의 번호
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 maxLength: 30
 *                 description: 업데이트된 홍보게시글의 제목
 *               content:
 *                 type: string
 *                 description: 업데이트된 홍보게시글의 내용
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: 업데이트된 홍보게시글의 태그들
 *               promotion_poster:
 *                 type: string
 *                 format: url
 *                 description: 업데이트될 홍보게시글의 포스터 이미지 주소
 *     responses:
 *       200:
 *         description: 홍보게시글이 성공적으로 업데이트됨
 *       400:
 *         description: 잘못된 요청 데이터
 *       404:
 *         description: 홍보게시글을 찾을 수 없음
 *
 *   get:
 *     tags:
 *       - Promotion
 *     summary: 특정 번호의 홍보게시글 조회
 *     parameters:
 *       - in: path
 *         name: promotionNumber
 *         required: true
 *         schema:
 *           type: number
 *           description: 조회할 홍보게시글의 번호
 *     responses:
 *       200:
 *         description: 특정 홍보게시글 반환
 *         content:
 *           application/json:
 *             examples:
 *               success:
 *                 value:
 *                   promotion_number: 2
 *                   title: "특정 홍보게시글 제목"
 *                   content: "특정 홍보게시글 내용"
 *                   poster_image: "/path/to/image2.jpg"
 *                   tags: ["태그A", "태그B"]
 *                   createdAt: "2023-02-01T00:00:00.000Z"
 *                   updatedAt: "2023-02-01T00:00:00.000Z"
 *       404:
 *         description: 홍보게시글을 찾을 수 없음
 *
 *   delete:
 *     tags:
 *       - Promotion
 *     summary: 특정 번호의 홍보게시글 삭제
 *     parameters:
 *       - in: path
 *         name: promotionNumber
 *         required: true
 *         schema:
 *           type: number
 *           description: 삭제할 홍보게시글의 번호
 *     responses:
 *       200:
 *         description: 홍보게시글이 성공적으로 삭제됨
 *       404:
 *         description: 홍보게시글을 찾을 수 없음
 *
 * /promotions/user/{userId}:
 *   get:
 *     tags:
 *       - Promotion
 *     summary: 특정 사용자의 모든 홍보게시글 조회
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           description: 조회할 사용자의 ID
 *     responses:
 *       200:
 *         description: 사용자의 홍보게시글 목록 반환
 *         content:
 *           application/json:
 *             examples:
 *               success:
 *                 value:
 *                   - promotion_number: 3
 *                     title: "사용자 관련 홍보게시글 제목"
 *                     content: "사용자 관련 홍보게시글 내용"
 *                     poster_image: "/path/to/user_image.jpg"
 *                     tags: ["태그X", "태그Y"]
 *                     createdAt: "2023-03-01T00:00:00.000Z"
 *                     updatedAt: "2023-03-01T00:00:00.000Z"
 *       404:
 *         description: 사용자를 찾을 수 없음
 */
