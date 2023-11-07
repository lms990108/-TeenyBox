import { Router } from "express";
import ShowController from "../controllers/showController";
import asyncHandler from "../common/utils/asyncHandler";

const showRouter = Router();

/**
 * @swagger
 * /show:
 *   get:
 *     tags: [Show]
 *     summary: 공연 전체 조회 API
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
 *         description: 페이지당 공연 개수
 *     responses:
 *       200:
 *         description: 공연 목록
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                shows:
 *                 type: array
 *                 description: 공연 배열을 반환합니다
 *                 items:
 *                  type: object
 *                  properties:
 */

/**
 * @swagger
 * /show/{showId}:
 *   get:
 *     tags: [Show]
 *     summary: 공연 상세 조회 API
 *     parameters:
 *       - in: path
 *         name: showId
 *         required: true
 *         schema:
 *           type: string
 *           description: showId
 *           example: "PF10033"
 *     responses:
 *       200:
 *         description: 성공 반환값
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: mongodb id
 *                   example: "6544bbb57fb7a9ce3075c52f"
 *                 showId:
 *                   type: string
 *                   description: 공연 id
 *                   example: "PF227440"
 *                 title:
 *                   type: string
 *                   description: 연극 제목
 *                   example: "21,000원 내고 우리 연극 보러 올 바에 차라리 그 돈으로 치킨을"
 *                 start_date:
 *                   type: Date
 *                   description: 공연 시작 일자
 *                   example: "2023-11-06T00:00:00.000Z"
 *                 end_date:
 *                   type: Date
 *                   description: 공연 종료 일자
 *                   example: "2023-11-10T00:00:00.000Z"
 *                 region:
 *                   type: string
 *                   description: 지역
 *                   example: "서울"
 *                 location:
 *                   type: string
 *                   description: 공연시설명
 *                   example: "모차르트홀 (모차르트홀)"
 *                 latitude:
 *                   type: number
 *                   description: 위도
 *                   example: 37.4855919
 *                 longitude:
 *                   type: number
 *                   description: 경도
 *                   example: 127.00420350000002
 *                 cast:
 *                   type: array
 *                   description: 출연진
 *                   example: ["박정자, 박성희, 오순영"]
 *                 creator:
 *                   type: string
 *                   description: 제작진
 *                   example: "윤정오, 이은석, 조현지 등"
 *                 runtime:
 *                   type: string
 *                   description: 런타임
 *                   example: "1시간 20분"
 *                 age:
 *                   type: string
 *                   description: 연령 제한
 *                   example: "만 12세 이상"
 *                 company:
 *                   type: string
 *                   description: 제작사
 *                   example: "(주)네오, 씨제스컬처 ((주)씨제스엔터테인먼트)"
 *                 price:
 *                   type: string
 *                   description: 티켓 가격
 *                   example: "전석 40,000원"
 *                 description:
 *                   type: string
 *                   description: 줄거리
 *                   example: ""
 *                 state:
 *                   type: string
 *                   description: 공연 상태
 *                   example: "공연중"
 *                 schedule:
 *                   type: string
 *                   description: 공연 일정
 *                   example: "월요일 ~ 금요일(17:00,19:30), 토요일 ~ 일요일(15:00,17:30), HOL(17:00,19:30)"
 *                 poster:
 *                   type: string
 *                   description: 포스터
 *                   example: "http://www.kopis.or.kr/upload/pfmPoster/PF_PF229026_231031_141835.gif"
 *                 detail_images:
 *                   type: array
 *                   description: 상세 이미지
 *                   example: ["http://www.kopis.or.kr/upload/pfmIntroImage/PF_PF229026_231031_0218351.jpg", "http://www.kopis.or.kr/upload/pfmIntroImage/PF_PF229026_231031_0218350.jpg"]
 *                 reviews:
 *                   type: array
 *                   description: 리뷰
 *                   example: []
 *                 createdAt:
 *                   type: Date
 *                   description: 생성 시간
 *                   example: "2023-11-06T15:55:24.610Z"
 *                 updatedAt:
 *                   type: Date
 *                   description: 업데이트 시간
 *                   example: "2023-11-06T16:07:32.102Z"
 */

/**
 * @swagger
 * /show/search/query:
 *   get:
 *     tags: [Show]
 *     summary: 공연 검색 API
 *     parameters:
 *      - in: query
 *        name: title
 *        schema:
 *         type: string
 *         description: 공연 제목, 부분 검색 가능
 *         example: 연애
 *      - in: query
 *        name: region
 *        schema:
 *         type: string
 *         description: 지역
 *         example: 서울
 *      - in: query
 *        name: state
 *        schema:
 *         type: string
 *         description: 공연 상태
 *         example: 공연중
 *     responses:
 *       200:
 *         description: 공연 목록
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                shows:
 *                 type: array
 *                 description: 공연 배열을 반환합니다
 *                 items:
 *                  type: object
 *                  properties:
 */

/**
 * @swagger
 * /show/{showId}:
 *   delete:
 *     tags: [Show]
 *     summary: 공연 삭제 API
 *     parameters:
 *       - in: path
 *         name: showId
 *         required: true
 *         schema:
 *           type: string
 *           description: showId
 *           example: "PF10033"
 *     responses:
 *       200:
 *         description: 성공 반환값
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 showId:
 *                   type: string
 *                   description: 공연 id
 *                   example: "PF227440"
 *                 message:
 *                   type: string
 *                   description: 메시지
 *                   example: "삭제되었습니다."
 */
showRouter.get("/", asyncHandler(ShowController.findShows));
showRouter.get("/:showId", asyncHandler(ShowController.findShowByShowId));
showRouter.get("/title/:title", asyncHandler(ShowController.findShowByTitle));
showRouter.get("/search/query", asyncHandler(ShowController.search));
showRouter.delete("/:showId", asyncHandler(ShowController.deleteByShowId));

export default showRouter;
