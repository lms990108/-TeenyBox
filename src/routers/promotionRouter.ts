import express from "express";
import asyncHandler from "../common/utils/asyncHandler";
import promotionController from "../controllers/promotionController";
import { validationMiddleware } from "../middlewares/validationMiddleware";
import { uploadLocal } from "../middlewares/localMiddleware"; // uploadLocal 미들웨어를 가져옵니다.
import * as promotionDto from "../dtos/promotionDto";

const router = express.Router();

// 생성: 새로운 게시물을 추가합니다.
router.post(
  "/add_promotion",
  uploadLocal.single("promotion_poster"), // S3 업로드 대신 로컬 업로드 미들웨어를 사용
  validationMiddleware(promotionDto.CreatePromotionDTO),
  asyncHandler(promotionController.createPromotion),
);

// 수정: 주어진 ID를 가진 게시물을 업데이트합니다.
router.put(
  "/update_promotion/:promotionNumber",
  uploadLocal.single("promotion_poster"),
  validationMiddleware(promotionDto.UpdatePromotionDTO),
  asyncHandler(promotionController.updatePromotion),
);

// 조회: 모든 게시물을 가져옵니다.
router.get("/", asyncHandler(promotionController.getAllPromotions));

// 조회: 게시물 번호를 기준으로 특정 게시물을 가져옵니다.
router.get(
  "/number/:promotionNumber",
  asyncHandler(promotionController.getPromotionByNumber),
);

// 조회: 사용자 ID를 기준으로 해당 사용자의 모든 게시물을 가져옵니다.
router.get(
  "/user/:userId",
  asyncHandler(promotionController.getPromotionsByUserId),
);

// 삭제: 게시물 번호를 기준으로 특정 게시물을 삭제합니다.
router.delete(
  "/delete_promotion/:promotionNumber",
  asyncHandler(promotionController.deletePromotionByNumber),
);

export default router;
