import { Request, Response } from "express";
import PostService from "../services/postService";

class PostController {
  async createPost(req: Request, res: Response): Promise<Response> {
    const post = await PostService.create(req.body);
    return res.status(201).json(post);
  }

  async updatePost(req: Request, res: Response): Promise<void> {
    const postNumber = Number(req.params.postNumber);
    const post = await PostService.update(postNumber, req.body);
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

  async deletePostByNumber(req: Request, res: Response): Promise<void> {
    const post = await PostService.deleteByPostNumber(
      Number(req.params.postNumber),
    );
    res.status(200).json(post);
  }
}

export default new PostController();
