import CommentModel, { IComment } from "../models/commentModel";
import { CreateCommentDTO, UpdateCommentDTO } from "../dtos/commentDto";
import NotFoundError from "../common/error/NotFoundError";
import BadRequestError from "../common/error/BadRequestError";
import { STATE } from "../common/enum/enum";

export class CommentRepository {
  // 댓글 생성
  async create(dto: CreateCommentDTO): Promise<IComment> {
    const comment = new CommentModel(dto);
    return await comment.save();
  }

  // 게시글 아이디로 모든 댓글 조회 (페이징 추가)
  async findByPostId(
    postId: string,
    skip: number,
    limit: number = 20,
  ): Promise<{ comments: IComment[]; totalComments: number }> {
    const [comments, totalComments] = await Promise.all([
      CommentModel.find({ post: postId })
        .populate({
          path: "user",
          select: "_id nickname profile_url state",
        })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      CommentModel.countDocuments({ post: postId }),
    ]);

    comments.forEach((comment) => {
      if (comment.user && comment.user.state === STATE.WITHDRAWN) {
        comment.user.nickname = null;
        comment.user.profile_url = null;
      }
    });

    return { comments, totalComments };
  }

  // 홍보 게시글 아이디로 모든 댓글 조회 (페이징 추가)
  async findByPromotionId(
    promotionId: string,
    skip: number,
    limit: number = 20,
  ): Promise<{ comments: IComment[]; totalComments: number }> {
    const [comments, totalComments] = await Promise.all([
      CommentModel.find({ promotion: promotionId })
        .populate({
          path: "user",
          select: "_id nickname profile_url state",
        })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      CommentModel.countDocuments({ promotion: promotionId }),
    ]);

    comments.forEach((comment) => {
      if (comment.user && comment.user.state === STATE.WITHDRAWN) {
        comment.user.nickname = null;
        comment.user.profile_url = null;
      }
    });

    return { comments, totalComments };
  }

  // 사용자 아이디로 모든 댓글 조회 (페이징 추가)
  async findByUserId(
    userId: string,
    skip: number,
    limit: number,
  ): Promise<{ comments: IComment[]; totalComments: number }> {
    const [comments, totalComments] = await Promise.all([
      await CommentModel.find({ user: userId })
        .populate({
          path: "user",
          select: "_id nickname profile_url state",
        })
        .populate({
          path: "post",
        })
        .populate({
          path: "promotion",
        })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      CommentModel.countDocuments({ user_id: userId }),
    ]);

    return { comments, totalComments };
  }

  // 댓글 조회
  async findOne(id: string): Promise<IComment> {
    const comment = await CommentModel.findById(id);
    if (!comment) {
      throw new NotFoundError("댓글을 찾을 수 없습니다.");
    }
    return comment;
  }

  // 댓글 수정
  async update(id: string, dto: UpdateCommentDTO): Promise<IComment | null> {
    return await CommentModel.findByIdAndUpdate(id, dto, { new: true });
  }

  // 댓글 삭제
  async delete(id: string): Promise<void> {
    await CommentModel.findByIdAndDelete(id);
  }

  // 선택 댓글 삭제 (마이페이지)
  async deleteComments(userId: string, commentIds: string[]): Promise<void> {
    const comments = await CommentModel.find({ _id: { $in: commentIds } });

    for (const comment of comments) {
      if (comment.user._id.toString() !== userId.toString()) {
        throw new BadRequestError(
          "사용자 ID와 댓글 소유자 ID가 일치하지 않습니다.",
        );
      }
    }
    await CommentModel.deleteMany({ _id: { $in: commentIds } });
  }

  // 선택 댓글 삭제 (관리자페이지)
  async deleteCommentsByAdmin(commentIds: string[]): Promise<void> {
    await CommentModel.deleteMany({ _id: { $in: commentIds } });
  }

  // 커뮤니티 게시글 id에 해당하는 모든 댓글 삭제
  async deleteCommentsByPostId(postId: string): Promise<void> {
    await CommentModel.deleteMany({ post: postId });
  }

  // 홍보 게시글 id에 해당하는 모든 댓글 삭제
  async deleteCommentsByPromotionId(promotionId: string): Promise<void> {
    await CommentModel.deleteMany({ promotion: promotionId });
  }

  // 게시글 아이디로 모든 댓글 조회 (페이징 추가)
  async getPostComments(
    skip: number,
    limit: number = 20,
  ): Promise<{ comments: IComment[]; totalComments: number }> {
    const [comments, totalComments] = await Promise.all([
      CommentModel.find({ post: { $exists: true } })
        .populate({
          path: "user",
          select: "_id nickname profile_url state",
        })
        .populate({
          path: "post",
          select: "post_number",
        })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      CommentModel.countDocuments({ post: { $exists: true } }),
    ]);

    comments.forEach((comment) => {
      if (comment.user && comment.user.state === STATE.WITHDRAWN) {
        comment.user.nickname = null;
        comment.user.profile_url = null;
      }
    });

    return { comments, totalComments };
  }

  // 홍보게시판 모든 댓글 조회 (페이징 처리)
  async getPromotionComments(
    skip: number,
    limit: number = 20,
  ): Promise<{ comments: IComment[]; totalComments: number }> {
    const [comments, totalComments] = await Promise.all([
      CommentModel.find({ promotion: { $exists: true } })
        .populate({
          path: "user",
          select: "_id nickname profile_url state",
        })
        .populate({
          path: "promotion",
          select: "promotion_number category",
        })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      CommentModel.countDocuments({ promotion: { $exists: true } }),
    ]);

    comments.forEach((comment) => {
      if (comment.user && comment.user.state === STATE.WITHDRAWN) {
        comment.user.nickname = null;
        comment.user.profile_url = null;
      }
    });

    return { comments, totalComments };
  }
}

export default new CommentRepository();
