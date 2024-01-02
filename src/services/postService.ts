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

    // 게시글 작성자와 현재 사용자 비교
    // 현재 동작이 제대로 되지 않음.
    if (post.user_id.toString() !== userId) {
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
  async deleteByPostNumber(postNumber: number): Promise<IPost> {
    const deletedPost = await PostRepository.deleteByPostNumber(postNumber);
    if (!deletedPost) {
      throw new NotFoundError("게시글을 찾을 수 없습니다.");
    }
    return deletedPost;
  }
}

export default new PostService();
