import express from "express";
import asyncHandler from "../common/utils/asyncHandler";
import commentController from "../controllers/commentController";
import { validationMiddleware } from "../middlewares/validationMiddleware";
import * as commentDto from "../dtos/commentDto";
import { authenticateUser } from "../middlewares/authUserMiddlewares";

const router = express.Router();

// 댓글 생성
router.post(
  "/add_comment",
  authenticateUser, // 사용자 인증 미들웨어 추가
  validationMiddleware(commentDto.CreateCommentDTO),
  asyncHandler(commentController.createComment),
);

// 특정 게시글의 모든 댓글 조회 (페이징 처리)
router.get(
  "/posts/:postId/comments",
  asyncHandler(commentController.getCommentsByPostId),
);

// 특정 홍보 게시글의 모든 댓글 조회 (페이징 처리)
router.get(
  "/promotions/:promotionId/comments",
  asyncHandler(commentController.getCommentsByPromotionId),
);

// 특정 사용자가 작성한 모든 댓글 조회 (페이징 처리)
router.get(
  "/users/:userId/comments",
  asyncHandler(commentController.getCommentsByUserId),
);

// 댓글 수정
router.put(
  "/update_comment/:commentId",
  validationMiddleware(commentDto.UpdateCommentDTO),
  asyncHandler(commentController.updateComment),
);

// 댓글 삭제
router.delete(
  "/delete_comment/:commentId",
  asyncHandler(commentController.deleteComment),
);

export default router;
