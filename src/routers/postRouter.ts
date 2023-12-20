import express from "express";
import asyncHandler from "../common/utils/asyncHandler";
import postController from "../controllers/postController";
import { validationMiddleware } from "../middlewares/validationMiddleware";
import * as postDto from "../dtos/postDto";
import { authenticateUser } from "../middlewares/authUserMiddlewares";

const router = express.Router();

/**
 * @swagger
 * /add_post:
 *   post:
 *     tags:
 *       - Post
 *     summary: 새로운 게시물 추가
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePostDTO'
 *     responses:
 *       201:
 *         description: 게시물이 성공적으로 생성됨.
 *       400:
 *         description: 잘못된 요청 데이터.
 */
router.post(
  "/add_post",
  authenticateUser,
  validationMiddleware(postDto.CreatePostDTO),
  asyncHandler(postController.createPost),
);

/**
 * @swagger
 * /update_post/{postNumber}:
 *   put:
 *     tags:
 *       - Post
 *     summary: 기존 게시물 업데이트
 *     parameters:
 *       - in: path
 *         name: postNumber
 *         required: true
 *         schema:
 *           type: number
 *           description: 게시물 번호
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePostDTO'
 *     responses:
 *       200:
 *         description: 게시물이 성공적으로 업데이트됨.
 *       400:
 *         description: 잘못된 요청 데이터.
 *       404:
 *         description: 게시물을 찾을 수 없음.
 */
router.put(
  "/update_post/:postNumber",
  validationMiddleware(postDto.UpdatePostDTO),
  asyncHandler(postController.updatePost),
);

/**
 * @swagger
 * /posts:
 *   get:
 *     tags:
 *       - Post
 *     summary: 모든 게시물 조회
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *           default: 1
 *           description: 페이지 번호
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 10
 *           description: 한 페이지 당 게시물 수
 *     responses:
 *       200:
 *         description: 게시물 목록 반환.
 */
router.get("/", asyncHandler(postController.getAllPosts));

/**
 * @swagger
 * /posts/number/{postNumber}:
 *   get:
 *     tags:
 *       - Post
 *     summary: 게시물 번호로 특정 게시물 조회
 *     parameters:
 *       - in: path
 *         name: postNumber
 *         required: true
 *         schema:
 *           type: number
 *           description: 게시물 번호
 *     responses:
 *       200:
 *         description: 특정 게시물 반환.
 *       404:
 *         description: 게시물을 찾을 수 없음.
 */
router.get("/number/:postNumber", asyncHandler(postController.getPostByNumber));

/**
 * @swagger
 * /posts/user/{userId}:
 *   get:
 *     tags:
 *       - Post
 *     summary: 사용자 ID로 사용자의 모든 게시물 조회
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           description: 사용자 ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *           default: 1
 *           description: 페이지 번호
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 10
 *           description: 한 페이지 당 게시물 수
 *     responses:
 *       200:
 *         description: 사용자의 게시물 목록 반환.
 *       404:
 *         description: 사용자를 찾을 수 없음.
 */
router.get("/user/:userId", asyncHandler(postController.getPostsByUserId));

/**
 * @swagger
 * /delete_post/{postNumber}:
 *   delete:
 *     tags:
 *       - Post
 *     summary: 게시물 번호로 특정 게시물 삭제
 *     parameters:
 *       - in: path
 *         name: postNumber
 *         required: true
 *         schema:
 *           type: number
 *           description: 게시물 번호
 *     responses:
 *       200:
 *         description: 게시물이 성공적으로 삭제됨.
 *       404:
 *         description: 게시물을 찾을 수 없음.
 */
router.delete(
  "/delete_post/:postNumber",
  asyncHandler(postController.deletePostByNumber),
);

export default router;
