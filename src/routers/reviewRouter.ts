import { Router } from "express";
import asyncHandler from "../common/utils/asyncHandler";
import reviewController from "../controllers/reviewController";

const reviewRouter = Router();

reviewRouter.post("/", asyncHandler(reviewController.create));
reviewRouter.patch("/:reviewId", asyncHandler(reviewController.update));
reviewRouter.get("/", asyncHandler(reviewController.findAll));
reviewRouter.get("/:showId", asyncHandler(reviewController.findOne));
reviewRouter.get(
  "/user/:userId",
  asyncHandler(reviewController.findReviewsByUserId),
);
reviewRouter.get(
  "/post/:postId",
  asyncHandler(reviewController.findReviewsByPostId),
);
reviewRouter.delete("/:reviewId", asyncHandler(reviewController.deleteOne));

export default reviewRouter;
