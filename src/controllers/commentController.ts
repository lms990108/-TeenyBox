import { Request, Response } from "express";
import CommentService from "../services/commentService";
import { AuthRequest } from "../middlewares/authUserMiddlewares";

class CommentController {
  // 댓글 생성
  async createComment(req: AuthRequest, res: Response): Promise<void> {
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
    const limit = parseInt(req.query.limit as string) || 20;

    const comments = await CommentService.getCommentsByPostId(
      postId,
      page,
      limit,
    );
    res.status(200).json(comments);
  }

  // 특정 홍보 게시글의 모든 댓글 조회 (페이징 처리 추가)
  async getCommentsByPromotionId(req: Request, res: Response): Promise<void> {
    const { promotionId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const comments = await CommentService.getCommentsByPromotionId(
      promotionId,
      page,
      limit,
    );
    res.status(200).json(comments);
  }

  // 특정 사용자가 작성한 모든 댓글 조회 (페이징 처리 추가)
  async getCommentsByUserId(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user._id;
    const page = parseInt(req.query.page as string) || undefined;
    const limit = parseInt(req.query.limit as string) || undefined;

    const comments = await CommentService.getCommentsByUserId(
      userId,
      page,
      limit,
    );
    res.status(200).json(comments);
  }

  // 댓글 수정
  async updateComment(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user.user_id;
    const { commentId } = req.params;
    const comment = await CommentService.updateComment(
      userId,
      commentId,
      req.body,
    );
    res.status(200).json(comment);
  }

  // 댓글 삭제
  async deleteComment(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user._id;
    const { commentId } = req.params;
    await CommentService.deleteComment(userId, commentId);
    res.status(200).json({ message: "댓글이 삭제되었습니다." });
  }

  // 선택 댓글 삭제 (마이페이지)
  async deleteComments(req: AuthRequest, res: Response) {
    const userId = req.user._id;
    const { commentIds } = req.body;
    await CommentService.deleteComments(userId, commentIds);
    res.status(200).json({ message: "댓글이 삭제되었습니다." });
  }

  // 자유게시판 모든 댓글 조회 (페이징 처리)
  async getAllComments(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const comments = await CommentService.getAllComments(page, limit);
    res.status(200).json(comments);
  }

  // 홍보게시판 모든 댓글 조회 (페이징 처리)
  async getAllPromotionComments(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const comments = await CommentService.getAllPromotionComments(page, limit);
    res.status(200).json(comments);
  }

  // 선택 댓글 삭제 (관리자페이지)
  async deleteCommentsByAdmin(req: Request, res: Response) {
    const { commentIds } = req.body;
    await CommentService.deleteCommentsByAdmin(commentIds);
    res.status(200).json({ message: "댓글이 삭제되었습니다." });
  }
}

export default new CommentController();
