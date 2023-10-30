import PostRepository from "../repositories/postRepository";
import { CreatePostDTO, UpdatePostDTO } from "../dtos/postDto";
import { IPost } from "../models/postModel";

class PostService {
  // 게시글 생성
  async create(postData: CreatePostDTO): Promise<IPost> {
    return await PostRepository.create(postData);
  }

  // 게시글 수정
  async update(
    post_number: number,
    updateData: UpdatePostDTO,
  ): Promise<IPost | null> {
    const updatedPost = await PostRepository.update(post_number, updateData);
    if (!updatedPost) {
      throw new Error("Post not found");
    }
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
      throw new Error("Post not found");
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
      throw new Error("Post not found");
    }
    return deletedPost;
  }
}

export default new PostService();
