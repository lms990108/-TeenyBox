import express from "express";
import asyncHandler from "../common/utils/asyncHandler";
import postController from "../controllers/postController";
import { validationMiddleware } from "../middlewares/validationMiddleware";
import * as postDto from "../dtos/postDto";
import { authenticateUser } from "../middlewares/authUserMiddlewares";

const router = express.Router();

router.post(
  "/add_post",
  authenticateUser,
  validationMiddleware(postDto.CreatePostDTO),
  asyncHandler(postController.createPost),
);

router.put(
  "/update_post/:postNumber",
  authenticateUser,
  validationMiddleware(postDto.UpdatePostDTO),
  asyncHandler(postController.updatePost),
);

router.get("/", asyncHandler(postController.getAllPosts));

router.get("/number/:postNumber", asyncHandler(postController.getPostByNumber));

router.get("/user/:userId", asyncHandler(postController.getPostsByUserId));

router.delete(
  "/delete_post/:postNumber",
  asyncHandler(postController.deletePostByNumber),
);

export default router;

/**
 * @swagger
 * tags:
 *   - name: Post
 *
 * /posts/add_post:
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
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: 게시물 제목
 *               content:
 *                 type: string
 *                 description: 게시물 내용
 *     responses:
 *       '201':
 *         description: 게시물이 성공적으로 생성됨
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PostResponse'
 *       '400':
 *         description: 잘못된 요청
 *
 * /posts/update_post/{postNumber}:
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
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: 업데이트된 게시물 제목
 *                 example: "기능 업데이트"
 *                 maxLength: 100
 *               content:
 *                 type: string
 *                 description: 업데이트된 게시물 내용
 *                 example: "피드백을 바탕으로 기능을 개선했습니다..."
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: 업데이트된 게시물 태그
 *                 example: ["개선", "피드백"]
 *     responses:
 *       '200':
 *         description: 게시물이 성공적으로 업데이트됨
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PostResponse'
 *       '400':
 *         description: 잘못된 요청
 *       '404':
 *         description: 게시물을 찾을 수 없음
 *
 * /posts:
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
 * /posts/number/{postNumber}:
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
 *               $ref: '#/components/schemas/PostResponse'
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
 * /posts/delete_post/{postNumber}:
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
 * components:
 *   schemas:
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
