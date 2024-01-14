import { Router } from "express";
import asyncHandler from "../common/utils/asyncHandler";
import reviewController from "../controllers/reviewController";
import { authenticateUser } from "../middlewares/authUserMiddlewares";

const reviewRouter = Router();

reviewRouter.post(
  "/:showId",
  authenticateUser,
  asyncHandler(reviewController.create),
);
reviewRouter.patch(
  "/:reviewId",
  authenticateUser,
  asyncHandler(reviewController.update),
);
reviewRouter.get("/", asyncHandler(reviewController.findAll));
reviewRouter.get("/:showId", asyncHandler(reviewController.findOne));
reviewRouter.get(
  "/user/:userId",
  asyncHandler(reviewController.findReviewsByUserId),
);
reviewRouter.get(
  "/show/:showId",
  asyncHandler(reviewController.findReviewsByShowId),
);
reviewRouter.delete("/:reviewId", asyncHandler(reviewController.deleteOne));

export default reviewRouter;
