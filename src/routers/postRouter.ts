import express from "express";
import asyncHandler from "../utils/asyncHandler";
import * as PostController from "../controllers/postController";
import { validationMiddleware } from "../middlewares/validationMiddleware";
import * as postDto from "../dtos/postDto";

const router = express.Router();

// 생성: 새로운 게시물을 추가합니다.
router.post(
  "/add_post",
  validationMiddleware(postDto.CreatePostDTO),
  asyncHandler(PostController.createPost),
);

// 수정: 주어진 ID를 가진 게시물을 업데이트합니다.
router.put(
  "/update_post/:post_number",
  validationMiddleware(postDto.UpdatePostDTO),
  asyncHandler(PostController.updatePost),
);

// 조회: 모든 게시물을 가져옵니다.
router.get("/", asyncHandler(PostController.getAllPosts));

// 조회: 게시물 번호를 기준으로 특정 게시물을 가져옵니다.
router.get("/number/:postNumber", asyncHandler(PostController.getPostByNumber));

// 조회: 사용자 ID를 기준으로 해당 사용자의 모든 게시물을 가져옵니다.
router.get("/user/:userId", asyncHandler(PostController.getPostsByUserId));

// 삭제: 게시물 번호를 기준으로 특정 게시물을 삭제합니다.
router.delete(
  "/number/:postNumber",
  asyncHandler(PostController.deletePostByNumber),
);

export default router;
