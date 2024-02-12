import PostRepository from "../repositories/postRepository";
import { CreatePostDTO, UpdatePostDTO } from "../dtos/postDto";
import { IPost } from "../models/postModel";
import NotFoundError from "../common/error/NotFoundError";
import UnauthorizedError from "../common/error/UnauthorizedError";
import InternalServerError from "../common/error/InternalServerError";
import { UserModel } from "../models/userModel";
import { IUser } from "../models/userModel";
import { ROLE } from "../common/enum/enum";
import commentService from "./commentService";

class PostService {
  // 게시글 생성
  async create(postData: CreatePostDTO, userId: string): Promise<IPost> {
    try {
      // 태그가 문자열로 들어왔다면 배열로 변환
      if (typeof postData.tags === "string") {
        postData.tags = postData.tags.split(",").map((tag) => tag.trim());
      } else if (Array.isArray(postData.tags)) {
        // tags 필드가 이미 배열이라면, 각 요소를 trim 처리
        postData.tags = postData.tags.map((tag) =>
          typeof tag === "string" ? tag.trim() : tag,
        );
      }

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
    if (!post || post.deletedAt != null) {
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
  async getAllPosts(
    page: number,
    limit: number,
    sortBy: string, // 정렬 기준
    sortOrder: "asc" | "desc", // 정렬 순서
  ): Promise<{
    posts: Array<IPost & { commentsCount: number }>;
    totalCount: number;
  }> {
    const skip = (page - 1) * limit;

    return await PostRepository.findAll(skip, limit, sortBy, sortOrder);
  }

  // 게시글 번호로 조회
  async findByPostNumber(postNumber: number): Promise<IPost> {
    const post = await PostRepository.findByPostNumber(postNumber);
    if (!post || post.deletedAt != null) {
      throw new NotFoundError("게시글을 찾을 수 없습니다.");
    }

    // 조회수 증가 로직 추가
    post.views = (post.views || 0) + 1;
    await post.save(); // 변경된 조회수 저장

    return post;
  }

  // userId로 게시글들 조회
  async findPostsByUserId(
    userId: string,
    page: number,
    limit: number,
  ): Promise<{ posts: IPost[]; totalCount: number }> {
    const skip = (page - 1) * limit;
    return await PostRepository.findPostsByUserIdWithCount(userId, skip, limit);
  }

  // 게시글 삭제 (postNumber를 기반으로)
  async deleteByPostNumber(postNumber: number, user: IUser): Promise<IPost> {
    // 1. 게시글 조회
    const post = await PostRepository.findByPostNumber(postNumber);
    if (!post || post.deletedAt != null) {
      throw new NotFoundError("게시글을 찾을 수 없습니다.");
    }

    // 2. 권한체크
    if (
      post.user_id["_id"].toString() !== user._id.toString() &&
      user.role !== ROLE.ADMIN
    ) {
      throw new UnauthorizedError("게시글 삭제 권한이 없습니다.");
    }

    // 3. 삭제
    const deletedPost = await PostRepository.deleteByPostNumber(postNumber);
    commentService.deleteCommentsByPostId(post._id);

    return deletedPost;
  }

  // 통합 검색
  async searchPosts(
    type: string,
    query: string,
    page: number,
    limit: number,
  ): Promise<{ posts: IPost[]; totalCount: number }> {
    const skip = (page - 1) * limit;

    let searchQuery;
    if (type === "title") {
      searchQuery = {
        title: { $regex: query, $options: "i" },
        deletedAt: null,
      };
    } else if (type === "tag") {
      searchQuery = {
        tags: { $regex: query, $options: "i" },
        deletedAt: null,
      };
    } else {
      throw new Error("잘못된 타입입니다.");
    }

    return await PostRepository.findByQuery(searchQuery, skip, limit);
  }

  // 게시글 일괄 삭제
  async deleteMany(postNumbers: number[], user: IUser): Promise<void> {
    const posts = await PostRepository.findMany(postNumbers);

    if (user.role !== ROLE.ADMIN) {
      // 사용자가 관리자가 아닌 경우에만 권한 확인
      const authorizedPosts = posts.filter(
        (post) => post.user_id["_id"].toString() === user._id.toString(),
      );

      if (authorizedPosts.length !== postNumbers.length) {
        throw new UnauthorizedError("삭제 권한이 없습니다.");
      }
    }

    await PostRepository.deleteMany(postNumbers);

    // 댓글 삭제용 반복문
    for (const postNumber of postNumbers) {
      const post = await PostRepository.findByPostNumber(postNumber);
      commentService.deleteCommentsByPostId(post._id);
    }
  }

  // 게시글 추천
  async likePost(postNumber: number, userId: string): Promise<IPost> {
    const post = await PostRepository.findByPostNumber(postNumber);
    if (!post || post.deletedAt != null) {
      throw new NotFoundError("게시글을 찾을 수 없습니다.");
    }

    // 사용자가 이미 추천했는지 확인
    if (post.likedUsers.includes(userId)) {
      throw new Error("이미 추천한 게시글입니다.");
    }

    // 중복 추천이 아닌 경우, 사용자 ID를 배열에 추가
    post.likedUsers.push(userId);

    // 클라이언트에는 추천 수를 배열의 크기로 제공

    post.likes = post.likedUsers.length;
    await post.save();
    return post;
  }

  // 게시글 추천 취소
  async cancelLikePost(postNumber: number, userId: string): Promise<IPost> {
    const post = await PostRepository.findByPostNumber(postNumber);
    if (!post || post.deletedAt != null) {
      throw new NotFoundError("게시글을 찾을 수 없습니다.");
    }

    // 사용자가 추천했는지 확인
    if (!post.likedUsers.includes(userId)) {
      throw new Error("아직 추천하지 않은 게시글 입니다.");
    }

    // 추천했다면, 삭제해서 새로운 배열 추가
    post.likedUsers = post.likedUsers.filter(
      (user) => user !== userId.toString(),
    );

    // 클라이언트에는 추천 수를 배열의 크기로 제공
    post.likes = post.likedUsers.length;

    await post.save();
    return post;
  }
}

export default new PostService();
