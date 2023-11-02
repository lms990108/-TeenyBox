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

  // 자유게시판 게시글에 따른 댓글 조회 (페이징 처리 추가)
  async getCommentsByPostId(
    postId: string,
    page: number = 1,
    pageSize: number = 20,
  ) {
    try {
      const post = await PostModel.findById(postId);
      if (!post) {
        throw new NotFoundError("게시글을 찾을 수 없습니다.");
      }
      const skip = (page - 1) * pageSize;
      const comments = await CommentRepository.findByPostId(
        postId,
        skip,
        pageSize,
      );
      return comments;
    } catch (error) {
      throw new InternalServerError(
        `게시글 ${postId}에 대한 댓글을 가져오는데 실패했습니다: ${error.message}`,
      );
    }
  }

  // 홍보 게시글에 따른 댓글 조회 (페이징 처리 추가)
  async getCommentsByPromotionId(
    promotionId: string,
    page: number = 1,
    pageSize: number = 20,
  ) {
    try {
      const promotion = await PromotionModel.findById(promotionId);
      if (!promotion) {
        throw new NotFoundError("홍보 게시글을 찾을 수 없습니다.");
      }
      const skip = (page - 1) * pageSize;
      const comments = await CommentRepository.findByPromotionId(
        promotionId,
        skip,
        pageSize,
      );
      return comments;
    } catch (error) {
      throw new InternalServerError(
        `홍보 게시글 ${promotionId}에 대한 댓글을 가져오는데 실패했습니다: ${error.message}`,
      );
    }
  }

  // 사용자 ID에 따른 댓글 조회 (페이징 처리 추가)
  async getCommentsByUserId(
    userId: string,
    page: number = 1,
    pageSize: number = 20,
  ) {
    try {
      const skip = (page - 1) * pageSize;
      return await CommentRepository.findByUserId(userId, skip, pageSize);
    } catch (error) {
      throw new InternalServerError(
        `사용자 ${userId}에 대한 댓글을 가져오는데 실패했습니다: ${error.message}`,
      );
    }
  }

  // 댓글 수정
  async updateComment(id: string, dto: UpdateCommentDTO) {
    try {
      const updatedComment = await CommentRepository.update(id, dto);
      if (!updatedComment) {
        throw new NotFoundError("댓글을 찾을 수 없습니다.");
      }
      return updatedComment;
    } catch (error) {
      throw new InternalServerError(
        `댓글 ${id}를 수정하는데 실패했습니다: ${error.message}`,
      );
    }
  }

  // 댓글 삭제
  async deleteComment(id: string) {
    try {
      const deletedComment = await CommentRepository.delete(id);
      if (!deletedComment) {
        throw new NotFoundError("댓글을 찾을 수 없습니다.");
      }
      return deletedComment;
    } catch (error) {
      throw new InternalServerError(
        `댓글 ${id}를 삭제하는데 실패했습니다: ${error.message}`,
      );
    }
  }
}

export default new CommentService();
