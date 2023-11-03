import { Router } from "express";
import ShowController from "../controllers/showController";
import asyncHandler from "../common/utils/asyncHandler";

const showRouter = Router();

showRouter.get("/", asyncHandler(ShowController.findShows));
showRouter.get("/:showId", asyncHandler(ShowController.findShowByShowId));
showRouter.get("/title/:title", asyncHandler(ShowController.findShowByTitle));
showRouter.get("/search/title", asyncHandler(ShowController.searchByTitle));
showRouter.get("/search/status", asyncHandler(ShowController.searchByStatus));
showRouter.get("/search/region", asyncHandler(ShowController.searchByRegion));
showRouter.delete("/:showId", asyncHandler(ShowController.deleteByShowId));

export default showRouter;
