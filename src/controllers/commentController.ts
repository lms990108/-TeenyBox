import { Request, Response } from "express";
import CommentService from "../services/commentService";

class CommentController {
  // 댓글 생성
  async createComment(req: Request, res: Response): Promise<void> {
    const comment = await CommentService.createComment(req.body);
    res.status(201).json(comment);
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
