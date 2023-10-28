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

  // 게시글 전체 조회
  async findAll(): Promise<IPost[]> {
    return await PostModel.find();
  }

  // 게시글 번호로 조회
  async findByPostNumber(postNumber: number): Promise<IPost | null> {
    // 게시글이 없다면 null을 반환, 대신 이에 대한 에러 처리는 서비스에서 반드시 이루어져야 할 것
    return await PostModel.findOne({ post_number: postNumber });
  }

  // userId로 게시글들 조회
  async findPostsByUserId(userId: string): Promise<IPost[]> {
    return await PostModel.find({ user_id: userId });
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
}

export default new PostRepository();
