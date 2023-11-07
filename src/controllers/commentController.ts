import { Request, Response } from "express";
import CommentService from "../services/commentService";
import { AuthRequest } from "../middlewares/authUserMiddlewares";

class CommentController {
  // 댓글 생성
  async createComment(req: AuthRequest, res: Response): Promise<void> {
    // 인증된 사용자의 정보가 있는지 확인합니다.
    if (!req.user) {
      res.status(401).json({ message: "사용자 인증이 필요합니다." });
      return;
    }

    // 서비스에게 DTO와 함께 사용자 ID를 전달합니다.
    try {
      const newComment = await CommentService.createComment(
        req.body,
        req.user.user_id,
      );
      res.status(201).json(newComment);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // 특정 게시글의 모든 댓글 조회 (페이징 처리 추가)
  async getCommentsByPostId(req: Request, res: Response): Promise<void> {
    const { postId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 20;

    const comments = await CommentService.getCommentsByPostId(
      postId,
      page,
      pageSize,
    );
    res.status(200).json(comments);
  }

  // 특정 홍보 게시글의 모든 댓글 조회 (페이징 처리 추가)
  async getCommentsByPromotionId(req: Request, res: Response): Promise<void> {
    const { promotionId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 20;

    const comments = await CommentService.getCommentsByPromotionId(
      promotionId,
      page,
      pageSize,
    );
    res.status(200).json(comments);
  }

  // 특정 사용자가 작성한 모든 댓글 조회 (페이징 처리 추가)
  async getCommentsByUserId(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 20;

    const comments = await CommentService.getCommentsByUserId(
      userId,
      page,
      pageSize,
    );
    res.status(200).json(comments);
  }

  // 댓글 수정
  async updateComment(req: Request, res: Response): Promise<void> {
    const { commentId } = req.params;
    const comment = await CommentService.updateComment(commentId, req.body);
    res.status(200).json(comment);
  }

  // 댓글 삭제
  async deleteComment(req: Request, res: Response): Promise<void> {
    const { commentId } = req.params;
    const deletedComment = await CommentService.deleteComment(commentId);
    res.status(200).json(deletedComment);
  }
}

export default new CommentController();
