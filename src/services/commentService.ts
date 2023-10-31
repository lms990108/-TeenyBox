import { CreateCommentDTO, UpdateCommentDTO } from "../dtos/commentDto";
import CommentRepository from "../repositories/commentRepository";
import PostModel from "../models/postModel";
import PromotionModel from "../models/promotionModel";
import NotFoundError from "../common/error/NotFoundError";
import InternalServerError from "../common/error/InternalServerError";

class CommentService {
  // 댓글 생성
  async createComment(dto: CreateCommentDTO) {
    try {
      const newComment = await CommentRepository.create(dto);
      return newComment;
    } catch (error) {
      throw new InternalServerError(
        `댓글을 생성하는데 실패했습니다. comment: ${error.message}`,
      );
    }
  }

  // 자유게시판 게시글에 따른 댓글 조회
  async getCommentsByPostId(postId: string) {
    try {
      // 먼저 해당 게시글이 존재하는지 확인
      const post = await PostModel.findById(postId);
      if (!post) {
        throw new NotFoundError("게시글을 찾을 수 없습니다.");
      }

      // 게시글에 연결된 댓글을 조회
      const comments = await CommentRepository.findByPostId(postId);
      return comments;
    } catch (error) {
      throw new InternalServerError(
        `게시글 ${postId}에 대한 댓글을 가져오는데 실패했습니다: ${error.message}`,
      );
    }
  }

  // 홍보 게시글에 따른 댓글 조회
  async getCommentsByPromotionId(promotionId: string) {
    try {
      return await CommentRepository.findByPromotionId(promotionId);
    } catch (error) {
      throw new Error(
        `Failed to fetch comments for promotion ${promotionId}: ${error.message}`,
      );
    }
  }

  // 사용자 ID에 따른 댓글 조회
  async getCommentsByUserId(userId: string) {
    try {
      return await CommentRepository.findByUserId(userId);
    } catch (error) {
      throw new Error(
        `Failed to fetch comments for user ${userId}: ${error.message}`,
      );
    }
  }

  // 댓글 수정
  async updateComment(id: string, dto: UpdateCommentDTO) {
    try {
      const updatedComment = await CommentRepository.update(id, dto);
      if (!updatedComment) {
        throw new Error("Comment not found");
      }
      return updatedComment;
    } catch (error) {
      throw new Error(`Failed to update comment ${id}: ${error.message}`);
    }
  }

  // 댓글 삭제
  async deleteComment(id: string) {
    try {
      const deletedComment = await CommentRepository.delete(id);
      if (!deletedComment) {
        throw new Error("Comment not found");
      }
      return deletedComment;
    } catch (error) {
      throw new Error(`Failed to delete comment ${id}: ${error.message}`);
    }
  }
}

export default new CommentService();
