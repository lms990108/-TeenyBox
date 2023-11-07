import CommentModel, { IComment } from "../models/commentModel";
import { CreateCommentDTO, UpdateCommentDTO } from "../dtos/commentDto";

export class CommentRepository {
  // 댓글 생성
  async create(dto: CreateCommentDTO): Promise<IComment> {
    const comment = new CommentModel(dto);
    return await comment.save();
  }

  // 사용자 아이디로 모든 댓글 조회 (페이징 추가)
  async findByUserId(
    userId: string,
    skip: number,
    limit: number = 20,
  ): Promise<IComment[]> {
    return await CommentModel.find({ user_id: userId })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();
  }
  // 게시글 아이디로 모든 댓글 조회 (페이징 추가)
  async findByPostId(
    postId: string,
    skip: number,
    limit: number = 20,
  ): Promise<IComment[]> {
    return await CommentModel.find({ post: postId })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();
  }

  // 홍보 게시글 아이디로 모든 댓글 조회 (페이징 추가)
  async findByPromotionId(
    promotionId: string,
    skip: number,
    limit: number = 20,
  ): Promise<IComment[]> {
    return await CommentModel.find({ promotion: promotionId })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();
  }

  // 댓글 수정
  async update(id: string, dto: UpdateCommentDTO): Promise<IComment | null> {
    return await CommentModel.findByIdAndUpdate(id, dto, { new: true });
  }

  // 댓글 삭제
  async delete(id: string): Promise<IComment | null> {
    return await CommentModel.findByIdAndDelete(id);
  }
}

export default new CommentRepository();
