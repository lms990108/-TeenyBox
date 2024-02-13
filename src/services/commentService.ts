import { CreateCommentDTO, UpdateCommentDTO } from "../dtos/commentDto";
import CommentRepository from "../repositories/commentRepository";
import PostModel from "../models/postModel";
import PromotionModel from "../models/promotionModel";
import NotFoundError from "../common/error/NotFoundError";
import InternalServerError from "../common/error/InternalServerError";
import userService from "./userService";
import BadRequestError from "../common/error/BadRequestError";

class CommentService {
  // 댓글 생성
  async createComment(dto: CreateCommentDTO, userId: string) {
    try {
      const user = await userService.getUserById(userId);

      const commentData = {
        ...dto,
        user: user._id,
      };

      const newComment = await CommentRepository.create(commentData);
      return newComment;
    } catch (error) {
      throw new InternalServerError(
        `댓글을 생성하는데 실패했습니다. ${error.message}`,
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
  async getCommentsByUserId(userId: string, page: number, pageSize: number) {
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
  async updateComment(userId: string, id: string, dto: UpdateCommentDTO) {
    try {
      const comment = await CommentRepository.findOne(id);
      if (comment.user._id.toString() !== userId.toString()) {
        throw new BadRequestError(
          "사용자 ID와 댓글 소유자 ID가 일치하지 않습니다.",
        );
      }

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
  async deleteComment(userId: string, id: string) {
    try {
      const comment = await CommentRepository.findOne(id);
      if (comment.user._id.toString() !== userId.toString()) {
        throw new BadRequestError(
          "사용자 ID와 댓글 소유자 ID가 일치하지 않습니다.",
        );
      }

      await CommentRepository.delete(id);
    } catch (error) {
      throw new InternalServerError(
        `댓글 ${id}를 삭제하는데 실패했습니다: ${error.message}`,
      );
    }
  }

  // 선택 댓글 삭제 (마이페이지)
  async deleteComments(userId: string, commentIds: string[]) {
    await CommentRepository.deleteComments(userId, commentIds);
  }

  // 커뮤니티 게시글 id에 해당하는 모든 댓글 삭제
  async deleteCommentsByPostId(postId: string) {
    try {
      await CommentRepository.deleteCommentsByPostId(postId);
    } catch (error) {
      throw new InternalServerError(
        `게시글 ${postId}에 해당하는 댓글 삭제에 실패했습니다: ${error.message}`,
      );
    }
  }

  // 홍보 게시글 id에 해당하는 모든 댓글 삭제
  async deleteCommentsByPromotionId(promotionId: string) {
    try {
      await CommentRepository.deleteCommentsByPromotionId(promotionId);
    } catch (error) {
      throw new InternalServerError(
        `홍보 게시글 ${promotionId}에 해당하는 댓글 삭제에 실패했습니다: ${error.message}`,
      );
    }
  }

  // 커뮤니티 모든 댓글 조회 (페이징 처리)
  async getAllComments(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    return await CommentRepository.getPostComments(skip, limit);
  }

  // 홍보게시판 모든 댓글 조회 (페이징 처리)
  async getAllPromotionComments(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    return await CommentRepository.getPromotionComments(skip, limit);
  }

  // 선택 댓글 삭제 (관리자페이지)
  async deleteCommentsByAdmin(commentIds: string[]) {
    await CommentRepository.deleteCommentsByAdmin(commentIds);
  }
}

export default new CommentService();
