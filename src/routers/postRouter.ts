import express from "express";
import asyncHandler from "../utils/asyncHandler";
import postController from "../controllers/postController"; // 여기 수정
import { validationMiddleware } from "../middlewares/validationMiddleware";
import * as postDto from "../dtos/postDto";

const router = express.Router();

// 생성: 새로운 게시물을 추가합니다.
router.post(
  "/add_post",
  validationMiddleware(postDto.CreatePostDTO),
  asyncHandler(postController.createPost),
);

// 수정: 주어진 ID를 가진 게시물을 업데이트합니다.
router.put(
  "/update_post/:post_number",
  validationMiddleware(postDto.UpdatePostDTO),
  asyncHandler(postController.updatePost),
);

// 조회: 모든 게시물을 가져옵니다.
router.get("/", asyncHandler(postController.getAllPosts));

// 조회: 게시물 번호를 기준으로 특정 게시물을 가져옵니다.
router.get("/number/:postNumber", asyncHandler(postController.getPostByNumber));

// 조회: 사용자 ID를 기준으로 해당 사용자의 모든 게시물을 가져옵니다.
router.get("/user/:userId", asyncHandler(postController.getPostsByUserId));

// 삭제: 게시물 번호를 기준으로 특정 게시물을 삭제합니다.
router.delete(
  "/delete_post/:postNumber",
  asyncHandler(postController.deletePostByNumber),
);

export default router;
