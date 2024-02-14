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

// 통합검색
router.get("/search", asyncHandler(postController.searchPosts));

// 게시글 상세 조회
router.get("/:postNumber", asyncHandler(postController.getPostByNumber));

// 사용자별 게시글 조회
router.get("/user/:userId", asyncHandler(postController.getPostsByUserId));

// 게시글 일괄 삭제
router.delete(
  "/bulk",
  authenticateUser,
  asyncHandler(postController.deleteMultiplePosts),
);

// 게시글 삭제
router.delete(
  "/:postNumber",
  authenticateUser,
  asyncHandler(postController.deletePostByNumber),
);

// 게시글 추천
router.post(
  "/:postNumber/like",
  authenticateUser,
  asyncHandler(postController.likePost),
);

// 게시글 추천 취소
router.delete(
  "/:postNumber/like",
  authenticateUser,
  asyncHandler(postController.cancelLikePost),
);

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
 *                 tags:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: 게시글에 사용될 태그 배열
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
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: post_number
 *           description: 정렬 기준
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           default: desc
 *           description: asc = 오름차순, desc = 내림차순
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
 *                 tags: ["태그1", "태그2"]
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
 *                 tags: ["태그1", "태그2"]
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
 * /posts/bulk:
 *   delete:
 *     tags:
 *       - Post
 *     summary: 여러 게시물 일괄 삭제
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               postNumbers:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: 삭제할 게시물 번호들
 *             example:
 *               postNumbers: [1, 2, 3]
 *     responses:
 *       '200':
 *         description: 게시물들이 성공적으로 삭제됨
 *       '400':
 *         description: 잘못된 요청
 *       '401':
 *         description: 인증 실패
 *
 * /posts/user/{userId}:
 *   get:
 *     tags:
 *       - Post
 *     summary: 특정 사용자의 게시물 모두 조회, 이제 totalCounts도 제공
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
 *     summary: 게시글을 제목또는 태그로 검색
 *     parameters:
 *       - in: query
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *         description: 검색할 유형
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: 검색어
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
 *                     tags: ["태그1", "태그2"]
 *                     createdAt: "2023-01-01T00:00:00.000Z"
 *                     updatedAt: "2023-01-01T00:00:00.000Z"
 *       404:
 *         description: 검색 결과를 찾을 수 없음
 *
 * /posts/{postNumber}/like:
 *   post:
 *     tags:
 *       - Post
 *     summary: 게시글 추천
 *     description: 지정된 게시글에 대한 추천을 추가합니다.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postNumber
 *         required: true
 *         schema:
 *           type: integer
 *         description: 추천할 게시글의 고유 식별자
 *     responses:
 *       200:
 *         description: 게시글 추천 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: 성공 메시지
 *                 post_number:
 *                   type: integer
 *                   description: 게시글 고유 식별자
 *                 likes:
 *                   type: integer
 *                   description: 현재 추천 수
 *               example:
 *                 message: 게시글이 성공적으로 추천되었습니다.
 *                 post_number: 37
 *                 likes: 10
 *   delete:
 *     tags:
 *       - Post
 *     summary: 게시글 추천 취소
 *     description: 지정된 게시글에 대한 추천을 취소합니다.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postNumber
 *         required: true
 *         schema:
 *           type: integer
 *         description: 추천할 게시글의 고유 식별자
 *     responses:
 *       200:
 *         description: 게시글 추천 취소 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: 성공 메시지
 *                 post_number:
 *                   type: integer
 *                   description: 게시글 고유 식별자
 *                 likes:
 *                   type: integer
 *                   description: 현재 추천 수
 *               example:
 *                 message: 게시글 추천이 성공적으로 취소되었습니다.
 *                 post_number: 37
 *                 likes: 10
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
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: 게시글에 사용될 태그 배열
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
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: 게시글에 사용될 태그 배열
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
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: 게시글에 사용될 태그 배열
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
