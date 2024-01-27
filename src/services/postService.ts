import PostRepository from "../repositories/postRepository";
import { CreatePostDTO, UpdatePostDTO } from "../dtos/postDto";
import { IPost } from "../models/postModel";
import NotFoundError from "../common/error/NotFoundError";
import UnauthorizedError from "../common/error/UnauthorizedError";
import InternalServerError from "../common/error/InternalServerError";
import { UserModel } from "../models/userModel";

class PostService {
  // 게시글 생성
  async create(postData: CreatePostDTO, userId: string): Promise<IPost> {
    try {
      // 사용자 정보 조회
      const user = await UserModel.findOne({ _id: userId });
      if (!user) {
        throw new NotFoundError("사용자를 찾을 수 없습니다.");
      }

      // 게시글 데이터에 사용자 ID와 닉네임 추가
      const postDataWithUser = {
        ...postData,
        user_id: userId,
      };

      // 게시글 생성
      const newPost = await PostRepository.create(postDataWithUser);
      return newPost;
    } catch (error) {
      throw new InternalServerError(
        `게시글을 생성하는데 실패했습니다. ${error.message}`,
      );
    }
  }

  // 게시글 수정
  async update(
    post_number: number,
    updateData: UpdatePostDTO,
    userId: string,
  ): Promise<IPost | null> {
    // 게시글 조회
    const post = await PostRepository.findByPostNumber(post_number);
    if (!post) {
      throw new NotFoundError("게시글을 찾을 수 없습니다.");
    }

    if (post.user_id["_id"].toString() !== userId.toString()) {
      throw new UnauthorizedError("게시글 수정 권한이 없습니다.");
    }

    // 게시글 업데이트
    const updatedPost = await PostRepository.update(post_number, updateData);
    return updatedPost;
  }

  // 게시글 전체 조회 & 페이징
  async findAll(page: number, limit: number): Promise<IPost[]> {
    const skip = (page - 1) * limit;
    return await PostRepository.findAll(skip, limit);
  }

  // 게시글 번호로 조회
  async findByPostNumber(postNumber: number): Promise<IPost> {
    const post = await PostRepository.findByPostNumber(postNumber);
    if (!post) {
      throw new NotFoundError("게시글을 찾을 수 없습니다.");
    }
    return post;
  }

  // userId로 게시글들 조회
  async findPostsByUserId(
    userId: string,
    page: number,
    limit: number,
  ): Promise<IPost[]> {
    const skip = (page - 1) * limit;
    return await PostRepository.findPostsByUserId(userId, skip, limit);
  }

  // 게시글 삭제 (postNumber를 기반으로)
  async deleteByPostNumber(postNumber: number, userId: string): Promise<IPost> {
    // 게시글 조회 -> 권한 확인 -> 삭제

    // 1. 게시글 조회
    const post = await PostRepository.findByPostNumber(postNumber);
    if (!post) {
      throw new NotFoundError("게시글을 찾을 수 없습니다.");
    }

    // 2. 권한체크
    if (post.user_id["_id"].toString() !== userId.toString()) {
      throw new UnauthorizedError("게시글 수정 권한이 없습니다.");
    }

    // 3. 삭제
    const deletedPost = await PostRepository.deleteByPostNumber(postNumber);

    return deletedPost;
  }

  // 게시글 제목 검색
  async findByTitle(
    title: string,
    page: number,
    limit: number,
  ): Promise<IPost[]> {
    const encodedTitle = encodeURIComponent(title); // 한글을 URL 인코딩
    const skip = (page - 1) * limit;
    return await PostRepository.findByTitle(encodedTitle, skip, limit);
  }
}

export default new PostService();
