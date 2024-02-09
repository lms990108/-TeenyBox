import express from "express";
import UserController from "../controllers/userController";
import {
  authenticateUser,
  authenticateAdmin,
} from "../middlewares/authUserMiddlewares";
import { UserRequestDTO } from "../dtos/userDto";
import { validationMiddleware } from "../middlewares/validationMiddleware";
import asyncHandler from "../common/utils/asyncHandler";

const router = express.Router();

/**
 * @swagger
 * /users:
 *   post:
 *     tags: [user]
 *     summary: 회원가입
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               user_id:
 *                 type: string
 *                 description: 사용자 소셜 아이디
 *                 example: "3145587907"
 *               social_provider:
 *                 type: string
 *                 description: 소셜 프로바이더
 *                 example: "kakao"
 *               nickname:
 *                 type: string
 *                 description: 닉네임
 *                 example: "아아아"
 *               interested_area:
 *                 type: string
 *                 description: 관심 지역
 *                 example: "제주"
 *               profile_url:
 *                 type: string
 *                 description: 프로필 이미지 파일 또는 이미지 URL
 *                 example: "https://elice-5th.s3.ap-northeast-2.amazonaws.com/ead34553_5fdc_4dce_8fef_038fe019a008_488f9638-800c-4bac-ad65-82877fbff79b.jpg"
 *               imageUrlsToDelete:
 *                type: array
 *                description: 삭제할 이미지 urls
 *                example:
 *                  - "https://elice-5th.s3.ap-northeast-2.amazonaws.com/2024-02-08T01%3A42%3A34.127Z_steak.JPG"
 *     responses:
 *       201:
 *         description: 회원가입 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Description of the property
 *                   example: "회원가입이 완료되었습니다."
 */
/**
 * @swagger
 * /users/nickname:
 *   post:
 *     tags: [user]
 *     summary: 닉네임 중복확인
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               user_id:
 *                 type: string
 *                 description: Description of the property
 *                 example: "3145587907"
 *               nickname:
 *                 type: string
 *                 description: Description of the property
 *                 example: "아아아"
 *     responses:
 *       201:
 *         description: 닉네임 사용 가능
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Description of the property.
 *                   example: "사용 가능한 닉네임입니다."
 */
/**
 * @swagger
 * /users/login/kakao:
 *   post:
 *     tags: [user]
 *     summary: 카카오 로그인
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               authorizationCode:
 *                 type: string
 *                 description: 카카오에서 발급받은 인가 코드
 *                 example: "QG3NoMqbpiX2XAu96FWmFLnIUY57WIMRM3CKqYqmO_Zyr_4nq73fBzpmx-YKKiVOAAABi5GtbNRb9Pmr5eg_ZA"
 *     responses:
 *       200:
 *         description: 로그인 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: 로그인 성공 메시지
 *                   example: "로그인 되었습니다."
 *       302:
 *         description: 회원가입 필요
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: 회원가입 필요 메시지
 *                   example: "회원가입이 필요합니다."
 *                 kakaoUserData:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: 카카오 사용자 고유 ID
 *                       example: 3145587907
 *                     profileUrl:
 *                       type: string
 *                       description: 카카오 사용자 프로필 이미지 URL
 *                       example: "http://k.kakaocdn.net/dn/cCQQeL/btsv8geanip/pI7obDOjkB6qRQwGFRb1jk/img_640x640.jpg"
 *                     nickname:
 *                       type: string
 *                       description: 카카오 사용자 닉네임
 *                       example: "허은리"
 *                 social_provider:
 *                   type: string
 *                   description: 소셜 프로바이더 (카카오)
 *                   example: "kakao"
 */
/**
 * @swagger
 * /users/login/naver:
 *   post:
 *     tags: [user]
 *     summary: 네이버 로그인
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               authorizationCode:
 *                 type: string
 *                 description: 네이버에서 발급받은 인가 코드
 *                 example: "GsRL1CYcDVqrcy6vwJ"
 *               state:
 *                 type: string
 *                 description: 상태 매개변수
 *                 example: "psg9Ns2m2n"
 *     responses:
 *       200:
 *         description: 로그인 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: 로그인 성공 메시지
 *                   example: "로그인 되었습니다."
 *       302:
 *         description: 회원가입 필요
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: 회원가입 필요 메시지
 *                   example: "회원가입이 필요합니다."
 *                 naverUserData:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: 네이버 사용자 고유 ID
 *                       example: "116217972498421836521"
 *                     profileUrl:
 *                       type: string
 *                       description: 네이버 사용자 프로필 이미지 URL
 *                       example: "https://lh3.googleusercontent.com/a/ACg8ocIRQmkBmWmhRc6-jXQw-K28fA303nnLDaRQabv-rR_h3Ys=s96-c"
 *                     nickname:
 *                       type: string
 *                       description: 네이버 사용자 닉네임
 *                       example: "은리"
 *                 social_provider:
 *                   type: string
 *                   description: 소셜 프로바이더 (네이버)
 *                   example: "naver"
 */
/**
 * @swagger
 * /users/login/google:
 *   post:
 *     tags: [user]
 *     summary: 구글 로그인
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               authorizationCode:
 *                 type: string
 *                 description: 구글에서 발급받은 인가 코드
 *                 example: "4%2F0AfJohXnehP85xqdMRGrVzRRZzWcv_WPRyiykLAD76s7mhPF4jTsSAvV3Q5dJDIe4V2_IEA"
 *     responses:
 *       200:
 *         description: 로그인 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: 로그인 성공 메시지
 *                   example: "로그인 되었습니다."
 *       302:
 *         description: 회원가입 필요
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: 회원가입 필요 메시지
 *                   example: "회원가입이 필요합니다."
 *                 googleUserData:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: 구글 사용자 고유 ID
 *                       example: "116217972498421836521"
 *                     profileUrl:
 *                       type: string
 *                       description: 구글 사용자 프로필 이미지 URL
 *                       example: "https://lh3.googleusercontent.com/a/ACg8ocIRQmkBmWmhRc6-jXQw-K28fA303nnLDaRQabv-rR_h3Ys=s96-c"
 *                     nickname:
 *                       type: string
 *                       description: 구글 사용자 닉네임
 *                       example: "은리"
 *                 social_provider:
 *                   type: string
 *                   description: 소셜 프로바이더 (구글)
 *                   example: "google"
 */
/**
 * @swagger
 * /users/logout:
 *   post:
 *     tags: [user]
 *     summary: 사용자 로그아웃
 *     responses:
 *       200:
 *         description: 로그아웃 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Description of the property
 *                   example: "로그아웃 되었습니다."
 */
/**
 * @swagger
 * /users:
 *   get:
 *     tags: [user]
 *     summary: 사용자 정보 조회
 *     responses:
 *       200:
 *         description: 사용자 정보 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: Description of the property
 *                       example: "6544044568271cc98730a052"
 *                     user_id:
 *                       type: string
 *                       description: Description of the property
 *                       example: "3145587907"
 *                     social_provider:
 *                       type: string
 *                       description: Description of the property
 *                       example: "kakao"
 *                     nickname:
 *                       type: string
 *                       description: Description of the property
 *                       example: "아아아"
 *                     profile_url:
 *                       type: string
 *                       description: Description of the property
 *                       example: "https://pds.joongang.co.kr/news/component/htmlphoto_mmdata/202306/25/488f9638-800c-4bac-ad65-82877fbff79b.jpg"
 *                     interested_area:
 *                       type: string
 *                       description: Description of the property
 *                       example: "제주"
 *                     role:
 *                       type: string
 *                       description: Description of the property
 *                       example: "user"
 *                     state:
 *                       type: string
 *                       description: Description of the property
 *                       example: "가입"
 *                     dibs:
 *                       type: array
 *                       description: Description of the property
 *                       example: []
 *                     post:
 *                       type: array
 *                       description: Description of the property
 *                       example: []
 *                     promotion:
 *                       type: array
 *                       description: Description of the property
 *                       example: []
 *                     comment:
 *                       type: array
 *                       description: Description of the property
 *                       example: []
 *                     review:
 *                       type: array
 *                       description: Description of the property
 *                       example: []
 */
/**
 * @swagger
 * /users:
 *   put:
 *     tags: [user]
 *     summary: 사용자 정보 수정
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               user_id:
 *                 type: string
 *                 description: 사용자 소셜 아이디
 *                 example: "3145587907"
 *               social_provider:
 *                 type: string
 *                 description: 소셜 프로바이더
 *                 example: "kakao"
 *               nickname:
 *                 type: string
 *                 description: 닉네임
 *                 example: "햄거버"
 *               interested_area:
 *                 type: string
 *                 description: 관심 지역
 *                 example: "서울"
 *               profile_url:
 *                 type: string
 *                 description: 프로필 이미지 파일 또는 이미지 URL
 *                 example: "https://elice-5th.s3.ap-northeast-2.amazonaws.com/ead34553_5fdc_4dce_8fef_038fe019a008_488f9638-800c-4bac-ad65-82877fbff79b.jpg"
 *               imageUrlsToDelete:
 *                type: array
 *                description: 삭제할 이미지 urls
 *                example:
 *                  - "https://elice-5th.s3.ap-northeast-2.amazonaws.com/2024-02-08T01%3A42%3A34.127Z_steak.JPG"
 *     responses:
 *       200:
 *         description: 사용자 정보 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Description of the property
 *                   example: "회원 정보가 수정되었습니다."
 */
/**
 * @swagger
 * /users:
 *   delete:
 *     tags: [user]
 *     summary: 사용자 정보 탈퇴로 변경
 *     responses:
 *       200:
 *         description: 사용자 정보 탈퇴 변경 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Description of the property
 *                   example: "회원 탈퇴가 완료되었습니다."
 */
/**
 * @swagger
 * /users/bookmarks:
 *   get:
 *     tags: [user]
 *     summary: 유저 찜 목록 조회
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
 *         description: 찜 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 bookmarks:
 *                   type: object
 *                   properties:
 *                     validShows:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           showId:
 *                             type: string
 *                             description: 공연 ID
 *                           title:
 *                             type: string
 *                             description: 공연 제목
 *                           poster:
 *                             type: string
 *                             description: 포스터 URL
 *                           location:
 *                             type: string
 *                             description: 장소
 *                           startDate:
 *                             type: string
 *                             format: date-time
 *                             description: 시작 날짜
 *                           endDate:
 *                             type: string
 *                             format: date-time
 *                             description: 종료 날짜
 *                           state:
 *                             type: string
 *                             description: 공연 상태
 *                     totalCount:
 *                       type: number
 *                       description: 전체 찜 목록의 항목 수
 *         example:
 *           bookmarks:
 *             validShows:
 *               - showId: "PF185284"
 *                 title: "2호선 세입자 [서울]"
 *                 poster: "http://www.kopis.or.kr/upload/pfmPoster/PF_PF185284_211230_095855.gif"
 *                 location: "바탕골소극장 (바탕골소극장)"
 *                 startDate: "2022-01-14T00:00:00.000Z"
 *                 endDate: "2024-02-29T00:00:00.000Z"
 *                 state: "공연중"
 *               - showId: "PF228269"
 *                 title: "2호선 세입자 [대구]"
 *                 poster: "http://www.kopis.or.kr/upload/pfmPoster/PF_PF228269_231020_141133.gif"
 *                 location: "송죽씨어터 (송죽씨어터)"
 *                 startDate: "2023-11-22T00:00:00.000Z"
 *                 endDate: "2024-01-07T00:00:00.000Z"
 *                 state: "공연완료"
 *             totalCount: 7
 */
/**
 * @swagger
 * /users/bookmarks/{showId}:
 *   get:
 *     tags: [user]
 *     summary: 찜 여부 확인
 *     responses:
 *       200:
 *         description: 찜 true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isBookmarked:
 *                   type: boolean
 *                   description: Description of the property
 *                   example: true
 */
/**
 * @swagger
 * /users/bookmarks/{showId}:
 *   post:
 *     tags: [user]
 *     summary: 찜 추가(공연 상세 페이지)
 *     responses:
 *       200:
 *         description: 찜 추가 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Description of the property
 *                   example: "공연 찜이 완료되었습니다."
 */
/**
 * @swagger
 * /users/bookmarks/{showId}:
 *   delete:
 *     tags: [user]
 *     summary: 찜 취소(공연 상세 페이지)
 *     responses:
 *       200:
 *         description: 찜 취소 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Description of the property
 *                   example: "공연 찜이 취소되었습니다."
 */
/**
 * @swagger
 * /users/bookmarks:
 *   delete:
 *     tags: [user]
 *     summary: 찜 취소(마이페이지 유저 찜 목록)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               showIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - "PF231614"
 *                   - "PF185284"
 *     responses:
 *       200:
 *         description: 찜 취소 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Description of the property
 *                   example: "찜한 공연이 삭제되었습니다."
 */
/**
 * @swagger
 * /users/admin/users:
 *   get:
 *     tags: [user]
 *     summary: 전체 회원 조회(관리자 페이지)
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: |
 *           페이지 번호 (기본값: 1)
 *     responses:
 *       200:
 *         description: 전체 회원 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       user_id:
 *                         type: string
 *                         example: "3145587907"
 *                       social_provider:
 *                         type: string
 *                         example: "kakao"
 *                       nickname:
 *                         type: string
 *                         example: "은리카카오"
 *                       role:
 *                         type: string
 *                         example: "admin"
 *                       state:
 *                         type: string
 *                         example: "가입"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-01-31T13:57:30.983Z"
 *                       deletedAt:
 *                         type: string
 *                         nullable: true
 *                         format: date-time
 *                         example: null
 *                 totalUsers:
 *                   type: integer
 *                   example: 14
 */
/**
 * @swagger
 * /users/admin/users:
 *   delete:
 *     tags: [user]
 *     summary: 선택한 회원 탈퇴(관리자 페이지)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               userIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - "654a4cfc2a8ed874281b68b1"
 *                   - "658ead7773cff144375f4d9a"
 *                   - "659eb0f9ed66cdc33be42b32"
 *     responses:
 *       200:
 *         description: 선택한 회원 탈퇴 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Description of the property
 *                   example: "선택한 회원의 탈퇴가 완료되었습니다."
 */

router.post(
  "/",
  validationMiddleware(UserRequestDTO),
  asyncHandler(UserController.RegisterUser),
);
router.post("/nickname", asyncHandler(UserController.checkNickname));
router.post("/login/kakao", asyncHandler(UserController.kakaoLogin));
router.post("/login/naver", asyncHandler(UserController.naverLogin));
router.post("/login/google", asyncHandler(UserController.googleLogin));
router.post("/logout", asyncHandler(UserController.logout));
router.get("/", authenticateUser, asyncHandler(UserController.getUser));
router.put("/", authenticateUser, asyncHandler(UserController.updateUser));
router.delete("/", authenticateUser, asyncHandler(UserController.deleteUser));
router.get(
  "/bookmarks",
  authenticateUser,
  asyncHandler(UserController.getBookmarks),
);
router.get(
  "/bookmarks/:showId",
  authenticateUser,
  asyncHandler(UserController.isBookmarked),
);
router.post(
  "/bookmarks/:showId",
  authenticateUser,
  asyncHandler(UserController.saveShow),
);
router.delete(
  "/bookmarks/:showId",
  authenticateUser,
  asyncHandler(UserController.cancelShow),
);
router.delete(
  "/bookmarks",
  authenticateUser,
  asyncHandler(UserController.cancelBookmarks),
);
router.get(
  "/admin/users",
  authenticateAdmin,
  asyncHandler(UserController.getAllUsers),
);
router.delete(
  "/admin/users",
  authenticateAdmin,
  asyncHandler(UserController.deleteUsers),
);

export default router;
