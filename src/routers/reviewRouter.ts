import { Router } from "express";
import asyncHandler from "../common/utils/asyncHandler";
import reviewController from "../controllers/reviewController";
import { authenticateUser } from "../middlewares/authUserMiddlewares";
import multer from "multer";

/**
 * @swagger
 * /reviews/{showId}:
 *   post:
 *     tags: [Review]
 *     summary: 리뷰 등록
 *     parameters:
 *      - in: path
 *        name: showId
 *        required: true
 *        schema:
 *         type: string
 *         description: 공연 아이디
 *         example: "PF227440"
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *            properties:
 *             title:
 *              type: string
 *              description: 리뷰 제목
 *              example: "와!"
 *             content:
 *              type: string
 *              description: 리뷰 내용
 *              example: "재미있는 공연이에요!"
 *             rate:
 *              type: number
 *              description: 평점 [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]
 *              example: 5
 *             imageUrls:
 *              type: array
 *              description: 이미지 urls
 *              example:
 *                - "https://elice-5th.s3.ap-northeast-2.amazonaws.com/2024-02-08T01%3A42%3A34.127Z_steak.JPG"
 *                - "https://elice-5th.s3.ap-northeast-2.amazonaws.com/2024-02-08T01%3A42%3A47.217Z_tea.JPG"
 *             imageUrlsToDelete:
 *              type: array
 *              description: 삭제할 이미지 urls
 *              example:
 *                - "https://elice-5th.s3.ap-northeast-2.amazonaws.com/2024-02-08T01%3A42%3A34.127Z_steak.JPG"
 *                - "https://elice-5th.s3.ap-northeast-2.amazonaws.com/2024-02-08T01%3A42%3A47.217Z_tea.JPG"
 *     responses:
 *       201:
 *         description: 등록 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                review:
 *                 type: object
 *                 description: 성공 응답
 *                 example:
 *                   - _id: "65a39e03a0f46b46abc87a32"
 *                     user_nickname: "동현123"
 *                     show_title: "'굿'바이 햄릿"
 *                     show_id: "PF230517"
 *                     user_id: "3246926995"
 *                     title: "미쳤다!"
 *                     content: "재미있는 공연이에요!"
 *                     rate: 5
 *                     image_urls: [
 *                       "https://elice-5th.s3.ap-northeast-2.amazonaws.com/%ED%85%8C%EC%8A%A4%ED%8A%B81.jpg",
 *                       "https://elice-5th.s3.ap-northeast-2.amazonaws.com/%ED%9A%8C.jpg"
 *                     ]
 *                     created_at: "2024-01-14T08:40:35.440Z"
 *                     updated_at: "2024-01-14T08:40:35.440Z"
 *                     deleted_at: null
 */

/**
 * @swagger
 * /reviews/{id}:
 *   patch:
 *     tags: [Review]
 *     summary: 리뷰 수정
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *         type: string
 *         description: 리뷰 아이디
 *         example: "65a39e03a0f46b46abc87a32"
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *            properties:
 *             title:
 *              type: string
 *              description: 리뷰 제목
 *              example: "와!"
 *             content:
 *              type: string
 *              description: 리뷰 내용
 *              example: "재미있는 공연이에요!"
 *             rate:
 *              type: number
 *              description: 평점 (0~5)
 *              example: 5
 *             imageUrls:
 *              type: array
 *              description: 이미지 urls
 *              example:
 *                - "https://elice-5th.s3.ap-northeast-2.amazonaws.com/2024-02-08T01%3A42%3A34.127Z_steak.JPG"
 *                - "https://elice-5th.s3.ap-northeast-2.amazonaws.com/2024-02-08T01%3A42%3A47.217Z_tea.JPG"
 *             imageUrlsToDelete:
 *              type: array
 *              description: 삭제할 이미지 urls
 *              example:
 *                - "https://elice-5th.s3.ap-northeast-2.amazonaws.com/2024-02-08T01%3A42%3A34.127Z_steak.JPG"
 *                - "https://elice-5th.s3.ap-northeast-2.amazonaws.com/2024-02-08T01%3A42%3A47.217Z_tea.JPG"
 *     responses:
 *       201:
 *         description: 등록 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                review:
 *                 type: object
 *                 description: 리뷰
 *                 example:
 *                   - _id: "65a39e03a0f46b46abc87a32"
 *                     user_nickname: "은리123"
 *                     show_title: "라이어"
 *                     title: "역시 라이어!"
 *                     content: "재미있는 공연이에요!"
 *                     rate: 4
 *                     image_urls: [
 *                       "https://elice-5th.s3.ap-northeast-2.amazonaws.com/%ED%85%8C%EC%8A%A4%ED%8A%B81.jpg",
 *                       "https://elice-5th.s3.ap-northeast-2.amazonaws.com/%ED%9A%8C.jpg"
 *                     ]
 *                     created_at: "2024-01-14T08:40:35.440Z"
 *                     updated_at: "2024-01-14T08:40:35.440Z"
 *                     deleted_at: null
 */

/**
 * @swagger
 * /reviews:
 *   get:
 *     tags: [Review]
 *     summary: 전체 리뷰 조회 및 유저별, 공연별 조회
 *     parameters:
 *      - in: query
 *        name: page
 *        schema:
 *         type: number
 *         description: 페이지 번호
 *      - in: query
 *        name: limit
 *        schema:
 *         type: number
 *         description: 페이지당 리뷰 개수
 *      - in: query
 *        name: userId
 *        schema:
 *         type: string
 *         description: 유저 아이디
 *      - in: query
 *        name: showId
 *        schema:
 *         type: string
 *         description: 공연 아이디
 *      - in: query
 *        name: order
 *        schema:
 *         type: string
 *         enum:
 *           - recent
 *           - rate
 *         description: |
 *           정렬 순서를 지정합니다.
 *           - 'recent': 최신순으로 정렬합니다.
 *           - 'rate': 높은 평점순으로 정렬합니다.
 *     responses:
 *       200:
 *         description: 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                reviews:
 *                 type: array
 *                 description: 리뷰 목록
 *                 example:
 *                   - _id: "65a39e03a0f46b46abc87a32"
 *                     user_id: "3246926995"
 *                     show_id: "PF233351"
 *                     content: "재미있는 공연이에요!"
 *                     rate: 5
 *                     created_at: "2024-01-14T08:40:35.440Z"
 *                     updated_at: "2024-01-14T08:40:35.440Z"
 *                     deleted_at: null
 *                   - _id: "65a3932cb95752766c2f12c0"
 *                     user_id: "3246926995"
 *                     show_id: "PF185284"
 *                     content: "test2"
 *                     rate: 3
 *                     created_at: "2024-01-14T07:32:54.162Z"
 *                     updated_at: "2024-01-14T07:35:40.862Z"
 *                     deleted_at: null
 */

/**
 * @swagger
 * /reviews/{id}:
 *   get:
 *     tags: [Review]
 *     summary: 단일 리뷰 조회
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *         type: string
 *         description: 리뷰 아이디
 *         example: "65a39e03a0f46b46abc87a32"
 *     responses:
 *       200:
 *         description: 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                review:
 *                 type: object
 *                 description: 리뷰 내용
 *                 example:
 *                   - _id: "65a39e03a0f46b46abc87a32"
 *                     user_nickname: "동현123"
 *                     show_title: "'굿'바이 햄릿"
 *                     title: "미쳤다!"
 *                     content: "재미있는 공연이에요!"
 *                     rate: 5
 *                     created_at: "2024-01-14T08:40:35.440Z"
 *                     updated_at: "2024-01-14T08:40:35.440Z"
 *                     deleted_at: null
 */

/**
 * @swagger
 * /reviews/{id}:
 *   delete:
 *     tags: [Review]
 *     summary: 리뷰 삭제
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *         type: string
 *         description: 리뷰 아이디
 *         example: "65a39e03a0f46b46abc87a32"
 *     responses:
 *       200:
 *         description: 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                message:
 *                 type: string
 *                 description: 성공 메시지
 *                 example: "리뷰가 성공적으로 삭제되었습니다."
 */

/**
 * @swagger
 * /reviews:
 *   delete:
 *     tags: [Review]
 *     summary: 리뷰 선택 삭제
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *            properties:
 *             reviewIds:
 *              type: array
 *              description: 리뷰 아이디 목록
 *              example: ["65b80fffe06a9e12cf14fea4", "65b80ffee06a9e12cf14fe9d"]
 *     responses:
 *       200:
 *         description: 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                message:
 *                 type: string
 *                 description: 성공 메시지
 *                 example: "리뷰가 성공적으로 삭제되었습니다."
 */

const upload = multer({ storage: multer.memoryStorage() });
const reviewRouter = Router();

reviewRouter.post(
  "/:showId",
  authenticateUser,
  upload.array("review_images"),
  asyncHandler(reviewController.create),
);
reviewRouter.patch(
  "/:id",
  authenticateUser,
  upload.array("review_images"),
  asyncHandler(reviewController.update),
);
reviewRouter.get("/", asyncHandler(reviewController.findReviews));
reviewRouter.get("/:id", asyncHandler(reviewController.findOne));
reviewRouter.delete(
  "/:id",
  authenticateUser,
  asyncHandler(reviewController.deleteOne),
);
reviewRouter.delete(
  "",
  authenticateUser,
  asyncHandler(reviewController.deleteMany),
);

export default reviewRouter;
