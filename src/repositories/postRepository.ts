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
  async findAllWithCommentsCount(
    skip: number,
    limit: number,
  ): Promise<{ posts: any[]; totalCount: number }> {
    const totalCount = await PostModel.countDocuments();

    const posts = await PostModel.aggregate([
      {
        $lookup: {
          from: "comments", // `CommentModel`의 컬렉션 이름 (MongoDB에서는 보통 소문자 및 복수형으로 표기)
          localField: "_id", // `PostModel`의 참조 필드
          foreignField: "post", // `CommentModel`의 게시글 참조 필드
          as: "comments", // 조인된 댓글 데이터를 저장할 필드 이름
        },
      },
      {
        $addFields: {
          commentsCount: { $size: "$comments" }, // 각 게시글에 대한 댓글 수 계산
        },
      },
      {
        $project: {
          comments: 0, // 댓글 데이터는 결과에서 제외, 댓글 수만 포함
        },
      },
      { $sort: { post_number: -1 } }, // 게시글 번호 내림차순 정렬
      { $skip: skip }, // 페이지네이션을 위한 스킵
      { $limit: limit }, // 페이지네이션을 위한 제한
    ]).exec();

    return { posts, totalCount };
  }

  // 게시글 번호로 조회
  async findByPostNumber(postNumber: number): Promise<IPost | null> {
    // 게시글이 없다면 null을 반환, 대신 이에 대한 에러 처리는 서비스에서 반드시 이루어져야 할 것
    return await PostModel.findOne({ post_number: postNumber })
      .populate({
        path: "user_id",
        select: "nickname profile_url _id",
      })
      .exec();
  }

  // userId로 게시글들 조회 + 갯수까지 추가
  async findPostsByUserIdWithCount(
    userId: string,
    skip: number,
    limit: number,
  ): Promise<{ posts: IPost[]; totalCount: number }> {
    // 게시글 총 갯수를 가져오는 쿼리
    const totalCount = await PostModel.countDocuments({ user_id: userId });

    const posts = await PostModel.find({ user_id: userId })
      .sort({ post_number: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "user_id",
        select: "nickname profile_url _id",
      })
      .exec();

    return { posts, totalCount };
  }

  // 게시글 삭제 (postNumber를 기반으로)
  async deleteByPostNumber(postNumber: number): Promise<IPost | null> {
    // 게시글이 없다면 null을 반환, 대신 이에 대한 에러 처리는 서비스에서 반드시 이루어져야 할 것
    // 게시글 조회 및 삭제 (조회 결과 리턴 = 삭제된 게시글)
    const postToDelete = await PostModel.findOneAndDelete({
      post_number: postNumber,
    });
    return postToDelete;
  }

  async findByTitle(
    title: string,
    skip: number,
    limit: number,
  ): Promise<{ posts: IPost[]; totalCount: number }> {
    const posts = await PostModel.find({ title: new RegExp(title, "i") })
      .sort({ post_number: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    // 총 게시글 개수 조회
    const totalCount = await PostModel.countDocuments({
      title: new RegExp(title, "i"),
    });

    return { posts, totalCount };
  }

  async findMultipleByPostNumbers(postNumbers: number[]): Promise<IPost[]> {
    return await PostModel.find({ post_number: { $in: postNumbers } })
      .populate({ path: "user_id", select: "nickname profile_url _id" })
      .exec();
  }

  async deleteMultipleByPostNumbers(postNumbers: number[]): Promise<void> {
    await PostModel.deleteMany({
      post_number: { $in: postNumbers },
    }).exec();
  }
}

export default new PostRepository();
