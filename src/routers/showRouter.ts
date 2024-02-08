import { Router } from "express";
import ShowController from "../controllers/showController";
import asyncHandler from "../common/utils/asyncHandler";
import { authenticateAdmin } from "../middlewares/authUserMiddlewares";

const showRouter = Router();

/**
 * @swagger
 * /shows:
 *   get:
 *     tags: [Show]
 *     summary: 공연 전체 조회 및 검색
 *     description: |
 *      제목, 지역, 공연 상태, 가격, 날짜, 장소로 검색이 가능합니다. 최신순, 평점순, 가격순으로 필터링이 가능합니다
 *      - 예시:
 *        - 지역: 서울, 경기/인천, 부산, 대구, 광주, 대전, 울산, 세종, 강원, 충청, 전라, 경상, 제주
 *        - 공연 상태: 공연예정, 공연중, 공연완료
 *        - 가격(최소, 최대)
 *        - 날짜
 *        - 위치 (location)
 *        - 순서: recent(최신순), price(낮은 가격순), rate(높은 평점순)
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
 *      - in: query
 *        name: title
 *        schema:
 *         type: string
 *         description: 공연 제목, 부분 검색 가능
 *      - in: query
 *        name: region
 *        schema:
 *         type: array
 *         description: 지역
 *         example: ["대구", "경상"]
 *      - in: query
 *        name: state
 *        schema:
 *         type: array
 *         description: 공연 상태
 *         example: ["공연중", "공연예정"]
 *      - in: query
 *        name: lowPrice
 *        schema:
 *         type: number
 *         description: 최소 가격
 *         example: 30000
 *      - in: query
 *        name: highPrice
 *        schema:
 *         type: number
 *         description: 최대 가격
 *         example: 60000
 *      - in: query
 *        name: date
 *        schema:
 *         type: string
 *         description: 날짜
 *         example: 2024-01-31
 *      - in: query
 *        name: location
 *        schema:
 *         type: string
 *         description: 공연 장소
 *         example: "국립극장"
 *      - in: query
 *        name: order
 *        schema:
 *         type: string
 *         enum:
 *           - recent
 *           - price
 *           - rate
 *         description: 순서 enum
 *         example: "recent"
 *     responses:
 *       200:
 *         description: 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                shows:
 *                 type: array
 *                 example:
 *                   - _id: "6544bbb57fb7a9ce3075c52f"
 *                     showId: "PF227440"
 *                     title: "가장 보통의 연애"
 *                     start_date: "2023-10-30T00:00:00.000Z"
 *                     end_date: "2023-12-31T00:00:00.000Z"
 *                     region: "서울"
 *                     location: "연극플레이스 혜화 (연극플레이스 혜화)"
 *                     latitude: 37.5809723
 *                     longitude: 127.003528
 *                     cast: ["박시안, 박은경, 문서우, 김유경, 이현재, 김대우, 문준혁 등"]
 *                     creator: ""
 *                     runtime: "1시간 30분"
 *                     age: "만 13세 이상"
 *                     company: "(주)네오, 씨제스컬처 ((주)씨제스엔터테인먼트)"
 *                     price: "40,000"
 *                     description: ""
 *                     state: "공연중"
 *                     schedule: "월요일 ~ 금요일(17:00,19:30), 토요일 ~ 일요일(15:00,17:30), HOL(17:00,19:30)"
 *                     poster: "http://www.kopis.or.kr/upload/pfmPoster/PF_PF229026_231031_141835.gif"
 *                     detail_images: ["http://www.kopis.or.kr/upload/pfmIntroImage/PF_PF229026_231031_0218351.jpg", "http://www.kopis.or.kr/upload/pfmIntroImage/PF_PF229026_231031_0218350.jpg"]
 *                     reviews: []
 *                     createdAt: "2023-11-06T15:55:24.610Z"
 *                     updatedAt: "2023-11-07T15:03:22.659Z"
 *                   - _id: "65490c7df46670b5a4f028dd"
 *                     showId: "PF225815"
 *                     title: "연애하기 좋은 날: 당근거래편 [대학로]"
 *                     start_date: "2023-09-22T00:00:00.000Z"
 *                     end_date: "2024-01-01T00:00:00.000Z"
 *                     region: "서울"
 *                     location: "우리소극장 [대학로] (우리소극장 [대학로])"
 *                     latitude: 37.5792262
 *                     longitude: 127.0051573
 *                     cast: ["오진영, 박현하, 박민서, 진주희, 김부연, 김이슬"]
 *                     creator: ""
 *                     runtime: "1시간 30분"
 *                     age: "만 13세 이상"
 *                     company: ""
 *                     price: "35,000"
 *                     description: ""
 *                     state: "공연중"
 *                     schedule: "월요일(19:30), 수요일 ~ 금요일(19:30), 토요일(15:00,17:00,19:00), 일요일(15:00,17:00)"
 *                     poster: "http://www.kopis.or.kr/upload/pfmPoster/PF_PF225815_230926_131717.gif"
 *                     detail_images: ["http://www.kopis.or.kr/upload/pfmIntroImage/PF_PF225815_230926_0117171.jpg"]
 *                     reviews: []
 *                     createdAt: "2023-11-06T15:55:41.991Z"
 *                     updatedAt: "2023-11-06T16:07:32.102Z"
 */

/**
 * @swagger
 * /shows/calendar:
 *   get:
 *     tags: [Show]
 *     summary: 달력 조회 함수
 *     description: |
 *      날짜마다 공연 개수를 조회합니다.
 *     responses:
 *       200:
 *         description: 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                showsNumberByDate:
 *                 type: array
 *                 example:
 *                   - date: "2023-07-31T00:00:00.000Z"
 *                     totalShows: 43
 *                   - date: "2023-08-01T00:00:00.000Z"
 *                     totalShows: 43
 *
 */

/**
 * @swagger
 * /shows/rank:
 *   get:
 *     tags: [Show]
 *     summary: 인기순(예매 높은 순) 공연 조회
 *     description: |
 *      rank 값으로 공연을 조회합니다. 18개 값을 리스트로 반환합니다.
 *     responses:
 *       200:
 *         description: 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                shows:
 *                 type: array
 *                 example:
 *                   - _id: "6544bbb57fb7a9ce3075c52f"
 *                     showId: "PF227440"
 *                     title: "가장 보통의 연애"
 *                     start_date: "2023-10-30T00:00:00.000Z"
 *                     end_date: "2023-12-31T00:00:00.000Z"
 *                     region: "서울"
 *                     location: "연극플레이스 혜화 (연극플레이스 혜화)"
 *                     latitude: 37.5809723
 *                     longitude: 127.003528
 *                     cast: ["박시안, 박은경, 문서우, 김유경, 이현재, 김대우, 문준혁 등"]
 *                     creator: ""
 *                     runtime: "1시간 30분"
 *                     age: "만 13세 이상"
 *                     company: "(주)네오, 씨제스컬처 ((주)씨제스엔터테인먼트)"
 *                     price: "40,000"
 *                     description: ""
 *                     state: "공연중"
 *                     schedule: "월요일 ~ 금요일(17:00,19:30), 토요일 ~ 일요일(15:00,17:30), HOL(17:00,19:30)"
 *                     poster: "http://www.kopis.or.kr/upload/pfmPoster/PF_PF229026_231031_141835.gif"
 *                     detail_images: ["http://www.kopis.or.kr/upload/pfmIntroImage/PF_PF229026_231031_0218351.jpg", "http://www.kopis.or.kr/upload/pfmIntroImage/PF_PF229026_231031_0218350.jpg"]
 *                     reviews: []
 *                     createdAt: "2023-11-06T15:55:24.610Z"
 *                     updatedAt: "2023-11-07T15:03:22.659Z"
 *                   - _id: "65490c7df46670b5a4f028dd"
 *                     showId: "PF225815"
 *                     title: "연애하기 좋은 날: 당근거래편 [대학로]"
 *                     start_date: "2023-09-22T00:00:00.000Z"
 *                     end_date: "2024-01-01T00:00:00.000Z"
 *                     region: "서울"
 *                     location: "우리소극장 [대학로] (우리소극장 [대학로])"
 *                     latitude: 37.5792262
 *                     longitude: 127.0051573
 *                     cast: ["오진영, 박현하, 박민서, 진주희, 김부연, 김이슬"]
 *                     creator: ""
 *                     runtime: "1시간 30분"
 *                     age: "만 13세 이상"
 *                     company: ""
 *                     price: "35,000"
 *                     description: ""
 *                     state: "공연중"
 *                     schedule: "월요일(19:30), 수요일 ~ 금요일(19:30), 토요일(15:00,17:00,19:00), 일요일(15:00,17:00)"
 *                     poster: "http://www.kopis.or.kr/upload/pfmPoster/PF_PF225815_230926_131717.gif"
 *                     detail_images: ["http://www.kopis.or.kr/upload/pfmIntroImage/PF_PF225815_230926_0117171.jpg"]
 *                     reviews: []
 *                     createdAt: "2023-11-06T15:55:41.991Z"
 *                     updatedAt: "2023-11-06T16:07:32.102Z"
 */

/**
 * @swagger
 * /shows/children:
 *   get:
 *     tags: [Show]
 *     summary: 가족 공연 조회
 *     description: |
 *      age 필드가 "전체 관람가", "만 5세 이상", "만 6세 이상", "만 7세 이상" 값으로 공연을 조회합니다. 18개 값을 리스트로 반환합니다.
 *     responses:
 *       200:
 *         description: 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                shows:
 *                 type: array
 *                 example:
 *                   - _id: "6544bbb57fb7a9ce3075c52f"
 *                     showId: "PF227440"
 *                     title: "가장 보통의 연애"
 *                     start_date: "2023-10-30T00:00:00.000Z"
 *                     end_date: "2023-12-31T00:00:00.000Z"
 *                     region: "서울"
 *                     location: "연극플레이스 혜화 (연극플레이스 혜화)"
 *                     latitude: 37.5809723
 *                     longitude: 127.003528
 *                     cast: ["박시안, 박은경, 문서우, 김유경, 이현재, 김대우, 문준혁 등"]
 *                     creator: ""
 *                     runtime: "1시간 30분"
 *                     age: "만 13세 이상"
 *                     company: "(주)네오, 씨제스컬처 ((주)씨제스엔터테인먼트)"
 *                     price: "40,000"
 *                     description: ""
 *                     state: "공연중"
 *                     schedule: "월요일 ~ 금요일(17:00,19:30), 토요일 ~ 일요일(15:00,17:30), HOL(17:00,19:30)"
 *                     poster: "http://www.kopis.or.kr/upload/pfmPoster/PF_PF229026_231031_141835.gif"
 *                     detail_images: ["http://www.kopis.or.kr/upload/pfmIntroImage/PF_PF229026_231031_0218351.jpg", "http://www.kopis.or.kr/upload/pfmIntroImage/PF_PF229026_231031_0218350.jpg"]
 *                     reviews: []
 *                     createdAt: "2023-11-06T15:55:24.610Z"
 *                     updatedAt: "2023-11-07T15:03:22.659Z"
 *                   - _id: "65490c7df46670b5a4f028dd"
 *                     showId: "PF225815"
 *                     title: "연애하기 좋은 날: 당근거래편 [대학로]"
 *                     start_date: "2023-09-22T00:00:00.000Z"
 *                     end_date: "2024-01-01T00:00:00.000Z"
 *                     region: "서울"
 *                     location: "우리소극장 [대학로] (우리소극장 [대학로])"
 *                     latitude: 37.5792262
 *                     longitude: 127.0051573
 *                     cast: ["오진영, 박현하, 박민서, 진주희, 김부연, 김이슬"]
 *                     creator: ""
 *                     runtime: "1시간 30분"
 *                     age: "만 13세 이상"
 *                     company: ""
 *                     price: "35,000"
 *                     description: ""
 *                     state: "공연중"
 *                     schedule: "월요일(19:30), 수요일 ~ 금요일(19:30), 토요일(15:00,17:00,19:00), 일요일(15:00,17:00)"
 *                     poster: "http://www.kopis.or.kr/upload/pfmPoster/PF_PF225815_230926_131717.gif"
 *                     detail_images: ["http://www.kopis.or.kr/upload/pfmIntroImage/PF_PF225815_230926_0117171.jpg"]
 *                     reviews: []
 *                     createdAt: "2023-11-06T15:55:41.991Z"
 *                     updatedAt: "2023-11-06T16:07:32.102Z"
 */

/**
 * @swagger
 * /shows/{id}:
 *   get:
 *     tags: [Show]
 *     summary: 공연 상세 정보 조회
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: 공연 아이디
 *           example: "PF227440"
 *     responses:
 *       200:
 *         description: 공연 상세 정보 조회 성공
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
 * /shows/{id}:
 *   delete:
 *     tags: [Show]
 *     summary: 공연 삭제
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: 공연 아이디
 *           example: "PF10033"
 *     responses:
 *       200:
 *         description: 공연 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 showId:
 *                   type: string
 *                   description: 공연 id
 *                   example: "PF10033"
 *                 message:
 *                   type: string
 *                   description: 메시지
 *                   example: "삭제되었습니다."
 */

showRouter.get("/", asyncHandler(ShowController.findShows));
showRouter.get("/rank", asyncHandler(ShowController.findShowsByRank));
showRouter.get("/children", asyncHandler(ShowController.findShowsForChildren));
showRouter.get("/calendar", asyncHandler(ShowController.findShowsNumberByDate));
showRouter.get("/:id", asyncHandler(ShowController.findShowByShowId));
showRouter.delete(
  "/:id",
  authenticateAdmin,
  asyncHandler(ShowController.deleteByShowId),
);

export default showRouter;
