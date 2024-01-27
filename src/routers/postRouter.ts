import express from "express";
import asyncHandler from "../common/utils/asyncHandler";
import postController from "../controllers/postController";
import { validationMiddleware } from "../middlewares/validationMiddleware";
import * as postDto from "../dtos/postDto";
import { authenticateUser } from "../middlewares/authUserMiddlewares";

const router = express.Router();

// 게시글 작성
router.post(
  "/",
  authenticateUser,
  validationMiddleware(postDto.CreatePostDTO),
  asyncHandler(postController.createPost),
);

// 게시글 수정
router.put(
  "/:postNumber",
  authenticateUser,
  validationMiddleware(postDto.UpdatePostDTO),
  asyncHandler(postController.updatePost),
);

// 모든 게시글 조회
router.get("/", asyncHandler(postController.getAllPosts));

// 게시글 상세 조회
router.get("/:postNumber", asyncHandler(postController.getPostByNumber));

// 사용자별 게시글 조회
router.get("/user/:userId", asyncHandler(postController.getPostsByUserId));

// 게시글 삭제
router.delete(
  "/:postNumber",
  authenticateUser,
  asyncHandler(postController.deletePostByNumber),
);

// 글 제목으로 검색
router.get("/search", asyncHandler(postController.searchPromotions));

export default router;

/**
 * @swagger
 * tags:
 *   - name: Post
 *
 * /posts:
 *   post:
 *     tags:
 *       - Post
 *     summary: 새 게시물 추가
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePostRequest'
 *     responses:
 *       '201':
 *         description: 게시물이 성공적으로 생성됨
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 post_number:
 *                   type: integer
 *                   description: 게시물 고유 식별자
 *                 user_id:
 *                   type: string
 *                   description: 사용자 ID
 *                 title:
 *                   type: string
 *                   description: 게시물 제목
 *                 content:
 *                   type: string
 *                   description: 게시물 내용
 *                 _id:
 *                   type: string
 *                   description: 게시물의 고유 MongoDB ID
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: 게시물 생성 시간
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   description: 게시물 마지막 수정 시간
 *                 __v:
 *                   type: integer
 *                   description: 버전
 *               example:
 *                 post_number: 37
 *                 user_id: "654a4cfc2a8ed874281b68b1"
 *                 title: "응답 확인 예시용 제목"
 *                 content: "응답 확인 예시용 내용"
 *                 _id: "65a89e82c3180cd22b2fdf2c"
 *                 createdAt: "2024-01-18T03:44:02.952Z"
 *                 updatedAt: "2024-01-18T03:44:02.952Z"
 *                 __v: 0
 *       '400':
 *         description: 잘못된 요청
 *
 *   get:
 *     tags:
 *       - Post
 *     summary: 모든 게시물 조회
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *           description: 페이지 번호
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           description: 페이지당 게시물 수
 *     responses:
 *       '200':
 *         description: 게시물 목록
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PostResponse'
 *       '404':
 *         description: 게시물을 찾을 수 없음
 *
 * /posts/{postNumber}:
 *   put:
 *     tags:
 *       - Post
 *     summary: 기존 게시물 업데이트
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postNumber
 *         required: true
 *         schema:
 *           type: integer
 *           description: 게시물 고유 식별자
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePostRequest'
 *     responses:
 *       '200':
 *         description: 게시물이 성공적으로 업데이트됨
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 post_number:
 *                   type: integer
 *                   description: 게시물 고유 식별자
 *                 user_id:
 *                   type: string
 *                   description: 사용자 ID
 *                 title:
 *                   type: string
 *                   description: 게시물 제목
 *                 content:
 *                   type: string
 *                   description: 게시물 내용
 *                 _id:
 *                   type: string
 *                   description: 게시물의 고유 MongoDB ID
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: 게시물 생성 시간
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   description: 게시물 마지막 수정 시간
 *                 __v:
 *                   type: integer
 *                   description: 버전
 *               example:
 *                 post_number: 37
 *                 user_id: "654a4cfc2a8ed874281b68b1"
 *                 title: "업데이트된 게시물 제목"
 *                 content: "업데이트된 게시물 내용"
 *                 _id: "65a89e82c3180cd22b2fdf2c"
 *                 createdAt: "2024-01-18T03:44:02.952Z"
 *                 updatedAt: "2024-01-18T04:00:00.000Z"
 *                 __v: 1
 *       '400':
 *         description: 잘못된 요청
 *       '404':
 *         description: 게시물을 찾을 수 없음
 *   get:
 *     tags:
 *       - Post
 *     summary: 특정 게시물 조회
 *     parameters:
 *       - in: path
 *         name: postNumber
 *         required: true
 *         schema:
 *           type: integer
 *           description: 조회할 게시물 번호
 *     responses:
 *       '200':
 *         description: 게시물 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 post_number:
 *                   type: integer
 *                   description: 게시물 고유 식별자
 *                 user_id:
 *                   type: string
 *                   description: 사용자 ID
 *                 title:
 *                   type: string
 *                   description: 게시물 제목
 *                 content:
 *                   type: string
 *                   description: 게시물 내용
 *                 _id:
 *                   type: string
 *                   description: 게시물의 고유 MongoDB ID
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: 게시물 생성 시간
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   description: 게시물 마지막 수정 시간
 *                 __v:
 *                   type: integer
 *                   description: 버전
 *               example:
 *                 post_number: 37
 *                 user_id: "654a4cfc2a8ed874281b68b1"
 *                 title: "업데이트된 게시물 제목"
 *                 content: "업데이트된 게시물 내용"
 *                 _id: "65a89e82c3180cd22b2fdf2c"
 *                 createdAt: "2024-01-18T03:44:02.952Z"
 *                 updatedAt: "2024-01-18T04:00:00.000Z"
 *                 __v: 1
 *       '404':
 *         description: 게시물을 찾을 수 없음
 *
 *   delete:
 *     tags:
 *       - Post
 *     summary: 특정 게시물 삭제
 *     parameters:
 *       - in: path
 *         name: postNumber
 *         required: true
 *         schema:
 *           type: integer
 *           description: 삭제할 게시물 번호
 *     responses:
 *       '200':
 *         description: 게시물 삭제 성공
 *       '404':
 *         description: 게시물을 찾을 수 없음
 *
 * /posts/user/{userId}:
 *   get:
 *     tags:
 *       - Post
 *     summary: 특정 사용자의 게시물 모두 조회
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           description: 조회할 사용자의 ID
 *     responses:
 *       '200':
 *         description: 사용자의 게시물 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PostResponse'
 *       '404':
 *         description: 사용자를 찾을 수 없음
 *
 * /posts/search:
 *   get:
 *     tags:
 *       - Post
 *     summary: 게시글을 제목으로 검색
 *     parameters:
 *       - in: query
 *         name: title
 *         required: false
 *         schema:
 *           type: string
 *         description: 검색할 게시글의 제목
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: 페이지 번호
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: 페이지당 게시글 수
 *     responses:
 *       200:
 *         description: 검색 결과 반환
 *         content:
 *           application/json:
 *             examples:
 *               success:
 *                 value:
 *                   - promotion_number: 1
 *                     title: "검색된 게시글 제목"
 *                     content: "검색된 게시글 내용"
 *                     createdAt: "2023-01-01T00:00:00.000Z"
 *                     updatedAt: "2023-01-01T00:00:00.000Z"
 *       404:
 *         description: 검색 결과를 찾을 수 없음
 *
 * components:
 *   schemas:
 *     CreatePostRequest:
 *       type: object
 *       required:
 *         - title
 *         - content
 *       properties:
 *         title:
 *           type: string
 *           description: 게시물 제목
 *         content:
 *           type: string
 *           description: 게시물 내용
 *     UpdatePostRequest:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: 업데이트된 게시물 제목
 *           maxLength: 100
 *         content:
 *           type: string
 *           description: 업데이트된 게시물 내용
 *     PostResponse:
 *       type: object
 *       properties:
 *         post_number:
 *           type: integer
 *           description: 게시물 고유 식별자
 *         title:
 *           type: string
 *           description: 게시물 제목
 *         content:
 *           type: string
 *           description: 게시물 내용
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: 생성 일시
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: 최종 수정 일시
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
