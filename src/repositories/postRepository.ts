import PostModel, { IPost } from "../models/postModel";
import { CreatePostDTO, UpdatePostDTO } from "../dtos/postDto";

class PostRepository {
  // 게시글 생성
  async create(postData: CreatePostDTO): Promise<IPost> {
    // 최신 게시글의 post_number 조회
    const latestPost = await PostModel.findOne().sort({ post_number: -1 });

    // 최신 게시글의 post_number가 있다면 그 값에 1을 더하고, 없다면 1로 설정
    const nextPostNumber =
      latestPost && latestPost.post_number ? latestPost.post_number + 1 : 1;

    postData.post_number = nextPostNumber;

    const post = new PostModel(postData);
    return await post.save();
  }

  // 게시글 수정
  async update(
    post_number: number,
    updateData: UpdatePostDTO,
  ): Promise<IPost | null> {
    return await PostModel.findOneAndUpdate(
      { post_number: post_number },
      updateData,
      {
        new: true,
      },
    );
  }

  // 게시글 전체 조회 & 페이징 + 게시글 댓글
  async findAll(
    skip: number,
    limit: number,
    sortBy: string,
    sortOrder: "asc" | "desc", // 추가된 부분: 정렬 순서
  ): Promise<{
    posts: Array<
      IPost & {
        commentsCount: number;
        user: { nickname: string; profile_url: string };
      }
    >;
    totalCount: number;
  }> {
    const totalCount = await PostModel.countDocuments({ deletedAt: null });

    let sortStage;
    if (sortBy !== "post_number") {
      sortStage = {
        $sort: { [sortBy]: sortOrder === "asc" ? 1 : -1, post_number: -1 },
      };
    } else {
      sortStage = { $sort: { [sortBy]: sortOrder === "asc" ? 1 : -1 } };
    }

    const aggregationResult = await PostModel.aggregate([
      {
        $match: {
          deletedAt: { $eq: null },
        },
      },
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "post",
          as: "comments",
        },
      },
      {
        $addFields: {
          commentsCount: { $size: "$comments" },
        },
      },
      // 사용자 정보를 가져오는 $lookup 추가
      {
        $lookup: {
          from: "users", // `users` 컬렉션의 이름을 정확히 맞춰야 합니다.
          localField: "user_id",
          foreignField: "_id",
          as: "user",
        },
      },
      // 배열로 반환된 사용자 정보를 단일 객체로 변환
      {
        $unwind: {
          path: "$user",
        },
      },
      {
        $project: {
          comments: 0,
        },
      },
      sortStage,
      { $skip: skip },
      { $limit: limit },
    ]).exec();

    // MongoDB 집계 결과를 명시적으로 타입 변환
    const posts = aggregationResult.map((post) => ({
      ...post,
      user: {
        nickname: post.user.nickname,
        profile_url: post.user.profile_url,
        state: post.user.state,
      },
      commentsCount: post.commentsCount,
    }));

    return { posts, totalCount };
  }

  // 게시글 번호로 조회
  async findByPostNumber(postNumber: number): Promise<IPost | null> {
    return await PostModel.findOne({ post_number: postNumber })
      .populate("user_id", "nickname profile_url state")
      .exec();
  }

  // userId로 게시글들 조회 + 갯수까지 추가
  async findPostsByUserIdWithCount(
    userId: string,
    skip: number,
    limit: number,
  ): Promise<{ posts: IPost[]; totalCount: number }> {
    // 게시글 총 갯수를 가져오는 쿼리
    const totalCount = await PostModel.countDocuments({
      user_id: userId,
      deletedAt: null,
    });

    const posts = await PostModel.find({ user_id: userId, deletedAt: null })
      .sort({ post_number: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "user_id",
        select: "nickname profile_url _id state",
      })
      .exec();

    return { posts, totalCount };
  }

  // 게시글 삭제
  async deleteByPostNumber(postNumber: number): Promise<IPost | null> {
    const postToDelete = await PostModel.findOneAndUpdate(
      { post_number: postNumber },
      { deletedAt: new Date() },
      { new: true },
    );
    return postToDelete;
  }

  // 통합 검색
  async findByQuery(
    query: object,
    skip: number,
    limit: number,
  ): Promise<{ posts: IPost[]; totalCount: number }> {
    const posts = await PostModel.find(query)
      .sort({ post_number: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "user_id",
        select: "nickname profile_url _id state",
      })
      .exec();

    const totalCount = await PostModel.countDocuments(query);

    return { posts, totalCount };
  }

  // 게시글 삭제 전 게시글 일괄 찾기
  async findMany(postNumbers: number[]): Promise<IPost[]> {
    return await PostModel.find({ post_number: { $in: postNumbers } })
      .populate({ path: "user_id", select: "nickname profile_url _id state" })
      .exec();
  }

  // 게시글 일괄 삭제
  async deleteMany(postNumbers: number[]): Promise<void> {
    const updateQuery = {
      $set: {
        deletedAt: new Date(),
      },
    };

    await PostModel.updateMany(
      { post_number: { $in: postNumbers } },
      updateQuery,
    ).exec();
  }
}

export default new PostRepository();
