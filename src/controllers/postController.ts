import { NextFunction, Request, Response } from "express";
import PostService from "../services/postService";

export const createPost = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response> => {
  const post = await PostService.create(req.body);
  return res.status(201).json(post);
};

export const updatePost = async (req: Request, res: Response) => {
  const postNumber = Number(req.params.post_number);
  const post = await PostService.update(postNumber, req.body);
  res.status(200).json(post);
};

export const getAllPosts = async (req: Request, res: Response) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 10);
  const posts = await PostService.findAll(page, limit);
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
