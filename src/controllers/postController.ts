import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/authUserMiddlewares";
import PostService from "../services/postService";

class PostController {
  async createPost(req: AuthRequest, res: Response): Promise<void> {
    // 인증된 사용자의 정보가 있는지 확인합니다.
    if (!req.user) {
      res.status(401).json({ message: "사용자 인증이 필요합니다." });
      return;
    }

    try {
      const post = await PostService.create(req.body, req.user._id);
      res.status(201).json(post);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updatePost(req: AuthRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ message: "사용자 인증이 필요합니다." });
      return;
    }

    const postNumber = Number(req.params.postNumber);
    const post = await PostService.update(postNumber, req.body, req.user._id);
    res.status(200).json(post);
  }

  async getAllPosts(req: Request, res: Response): Promise<void> {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const posts = await PostService.findAll(page, limit);
    res.status(200).json(posts);
  }

  async getPostByNumber(req: Request, res: Response): Promise<void> {
    const post = await PostService.findByPostNumber(
      Number(req.params.postNumber),
    );
    res.status(200).json(post);
  }

  async getPostsByUserId(req: Request, res: Response): Promise<void> {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const posts = await PostService.findPostsByUserId(
      req.params.userId,
      page,
      limit,
    );
    res.status(200).json(posts);
  }

  async deletePostByNumber(req: AuthRequest, res: Response): Promise<void> {
    // 인증된 사용자의 정보가 있는지 확인합니다.
    if (!req.user) {
      res.status(401).json({ message: "사용자 인증이 필요합니다." });
      return;
    }
    const post = await PostService.deleteByPostNumber(
      Number(req.params.postNumber),
      req.user._id,
    );
    res.status(200).json(post);
  }

  async searchPosts(req: Request, res: Response): Promise<void> {
    console.log("0번");

    try {
      const title = req.query.title as string;
      const page = Number(req.query.page || 1);
      const limit = Number(req.query.limit || 10);

      console.log("1번" + title);

      // 검색어가 없는 경우, 빈 리스트 반환
      if (!title) {
        res.status(200).json([]);
        return;
      }

      console.log("2번" + title);

      // 검색어가 있는 경우, 검색 결과 반환
      const searchResults = await PostService.findByTitle(title, page, limit);
      res.status(200).json(searchResults);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteMultiplePosts(req: AuthRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ message: "사용자 인증이 필요합니다." });
      return;
    }
    const postNumbers = req.body.postNumbers; // 게시글 번호 배열
    const deletedPosts = await PostService.deleteMultipleByPostNumbers(
      postNumbers,
      req.user._id,
    );
    res.status(200).json(deletedPosts);
  }
}

export default new PostController();
