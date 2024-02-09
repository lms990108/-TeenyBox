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

// 통합검색
router.get("/search", asyncHandler(promotionController.searchPromotions));

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

// 게시글 일괄 삭제
router.delete(
  "/bulk",
  authenticateUser,
  asyncHandler(promotionController.deleteMultiplePromotions),
);

// 글 삭제
router.delete(
  "/:promotionNumber",
  authenticateUser,
  asyncHandler(promotionController.deletePromotionByNumber),
);

// 게시글 추천
router.post(
  "/:promotionNumber/like",
  authenticateUser,
  asyncHandler(promotionController.likePromotion),
);

// 게시글 추천 취소
router.delete(
  "/:promotionNumber/like",
  authenticateUser,
  asyncHandler(promotionController.cancelLikePromotion),
);

export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Promotion:
 *       type: object
 *       required:
 *         - title
 *         - content
 *         - start_date
 *         - end_date
 *       properties:
 *         title:
 *           type: string
 *           maxLength: 40
 *           description: 홍보게시글의 제목
 *         content:
 *           type: string
 *           description: 홍보게시글의 내용
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: 홍보게시글에 사용될 태그 배열
 *         image_url:
 *           type: array
 *           items:
 *             type: string
 *             format: url
 *           description: 홍보게시글의 포스터 이미지 주소 배열
 *         start_date:
 *           type: string
 *           format: date-time
 *           description: 상영 시작일
 *         end_date:
 *           type: string
 *           format: date-time
 *           description: 상영 종료일
 *         category:
 *           type: string
 *           enum: ["연극", "기타"]
 *           description: 홍보게시글의 카테고리 ("연극" 또는 "기타")
 *         play_title:
 *           type: string
 *           description: 연극의 제목 (카테고리가 "연극"인 경우 필요)
 *         runtime:
 *           type: integer
 *           description: 연극의 런타임
 *         location:
 *           type: string
 *           description: 연극의 장소
 *         host:
 *           type: string
 *           description: 연극의 주최자
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * paths:
 *   /promotions:
 *     post:
 *       tags:
 *         - Promotion
 *       summary: 새로운 홍보게시글 추가
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Promotion'
 *       responses:
 *         '201':
 *           description: 홍보게시글이 성공적으로 추가됨
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Promotion'
 *     get:
 *       tags:
 *         - Promotion
 *       summary: 모든 홍보게시글 조회
 *       parameters:
 *         - in: query
 *           name: page
 *           schema:
 *             type: integer
 *             default: 1
 *             description: 페이지 번호
 *         - in: query
 *           name: limit
 *           schema:
 *             type: integer
 *             default: 10
 *             description: 페이지당 게시물 수
 *         - in: query
 *           name: sortBy
 *           schema:
 *             type: string
 *             default: promotion_number
 *             description: 정렬 기준
 *         - in: query
 *           name: sortOrder
 *           schema:
 *             type: string
 *             default: desc
 *             description: asc = 오름차순, desc = 내림차순
 *         - in: query
 *           name: category
 *           schema:
 *             type: string
 *             default: 필터없음
 *             description: 연극또는 기타 입력
 *       responses:
 *         '200':
 *           description: 홍보게시글 목록 반환
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Promotion'
 *
 *   /promotions/{promotionNumber}:
 *     put:
 *       tags:
 *         - Promotion
 *       summary: 주어진 번호의 홍보게시글 업데이트
 *       parameters:
 *         - in: path
 *           name: promotionNumber
 *           required: true
 *           schema:
 *             type: number
 *             description: 업데이트할 홍보게시글의 번호
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Promotion'
 *       responses:
 *         '200':
 *           description: 홍보게시글이 성공적으로 업데이트됨
 *     get:
 *       tags:
 *         - Promotion
 *       summary: 특정 번호의 홍보게시글 조회
 *       parameters:
 *         - in: path
 *           name: promotionNumber
 *           required: true
 *           schema:
 *             type: number
 *             description: 조회할 홍보게시글의 번호
 *       responses:
 *         '200':
 *           description: 특정 홍보게시글 반환
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Promotion'
 *     delete:
 *       tags:
 *         - Promotion
 *       summary: 특정 번호의 홍보게시글 삭제
 *       parameters:
 *         - in: path
 *           name: promotionNumber
 *           required: true
 *           schema:
 *             type: number
 *             description: 삭제할 홍보게시글의 번호
 *       responses:
 *         '200':
 *           description: 홍보게시글이 성공적으로 삭제됨
 *
 *   /promotions/bulk:
 *     delete:
 *       tags:
 *         - Promotion
 *       summary: 여러 홍보게시글 일괄 삭제
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - promotionNumbers
 *               properties:
 *                 promotionNumbers:
 *                   type: array
 *                   items:
 *                     type: integer
 *                   description: 삭제할 홍보게시글 번호들
 *       responses:
 *         '200':
 *           description: 홍보게시글들이 성공적으로 삭제됨
 *
 *   /promotions/user/{userId}:
 *     get:
 *       tags:
 *         - Promotion
 *       summary: 특정 사용자의 모든 홍보게시글 조회
 *       parameters:
 *         - in: path
 *           name: userId
 *           required: true
 *           schema:
 *             type: string
 *             description: 조회할 사용자의 ID
 *       responses:
 *         '200':
 *           description: 사용자의 홍보게시글 목록 반환
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Promotion'
 *
 *   /promotions/search:
 *     get:
 *       tags:
 *         - Promotion
 *       summary: 홍보게시글을 제목, 태그, 연극 제목중에 하나로 검색
 *       parameters:
 *         - in: query
 *           name: type
 *           required: true
 *           schema:
 *             type: string
 *             description: 검색할 유형
 *         - in: query
 *           name: query
 *           required: true
 *           schema:
 *             type: string
 *             description: 검색어
 *         - in: query
 *           name: page
 *           schema:
 *             type: integer
 *             default: 1
 *             description: 페이지 번호
 *         - in: query
 *           name: limit
 *           schema:
 *             type: integer
 *             default: 10
 *             description: 페이지당 게시글 수
 *       responses:
 *         '200':
 *           description: 검색 결과 반환
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Promotion'
 *
 *   /promotions/{promotionNumber}/like:
 *     post:
 *       tags:
 *         - Promotion
 *       summary: 특정 홍보게시글 추천
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: promotionNumber
 *           required: true
 *           schema:
 *             type: integer
 *             description: 추천할 홍보게시글의 번호
 *       responses:
 *         '200':
 *           description: 홍보게시글이 성공적으로 추천됨
 *     delete:
 *       tags:
 *         - Promotion
 *       summary: 특정 홍보게시글 추천 취소
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: promotionNumber
 *           required: true
 *           schema:
 *             type: integer
 *             description: 추천을 취소할 홍보게시글의 번호
 *       responses:
 *         '200':
 *           description: 홍보게시글 추천이 성공적으로 취소됨
 */
