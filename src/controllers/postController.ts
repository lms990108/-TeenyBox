import { Request, Response } from "express";
import PostService from "../services/postService";

export const createPost = async (req: Request, res: Response) => {
  const post = await PostService.create(req.body);
  res.status(201).json(post);
};

export const updatePost = async (req: Request, res: Response) => {
  const post = await PostService.update(req.params.postId, req.body);
  res.status(200).json(post);
};

export const getAllPosts = async (_: Request, res: Response) => {
  const posts = await PostService.findAll();
  res.status(200).json(posts);
};

export const getPostByNumber = async (req: Request, res: Response) => {
  const post = await PostService.findByPostNumber(
    Number(req.params.postNumber),
  );
  res.status(200).json(post);
};

export const getPostsByUserId = async (req: Request, res: Response) => {
  const posts = await PostService.findPostsByUserId(req.params.userId);
  res.status(200).json(posts);
};

export const deletePostByNumber = async (req: Request, res: Response) => {
  const post = await PostService.deleteByPostNumber(
    Number(req.params.postNumber),
  );
  res.status(200).json(post);
};
