import express from "express";
import UserController from "../controllers/userController";
import {
  checkLoginStatus,
  authenticateUser,
  authenticateAdmin,
} from "../middlewares/authUserMiddlewares";
import { UserRequestDTO } from "../dtos/userDto";
import { validationMiddleware } from "../middlewares/validationMiddleware";
import asyncHandler from "../common/utils/asyncHandler";

const router = express.Router();

/**
 * @swagger
 * /user/register:
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
 *                 description: Description of the property
 *                 example: "3145587907"
 *               social_provider:
 *                 type: string
 *                 description: Description of the property
 *                 example: "kakao"
 *               nickname:
 *                 type: string
 *                 description: Description of the property
 *                 example: "아아아"
 *               profile_url:
 *                 type: string
 *                 description: Description of the property
 *                 example: "https://pds.joongang.co.kr/news/component/htmlphoto_mmdata/202306/25/488f9638-800c-4bac-ad65-82877fbff79b.jpg"
 *               interested_area:
 *                 type: string
 *                 description: Description of the property
 *                 example: "제주"
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
 *                 user:
 *                   properties:
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
 */
/**
 * @swagger
 * /user/check-nickname:
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
 * /user/kakao-login:
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
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: 사용자 ID
 *                       example: "6544044568271cc98730a052"
 *                     user_id:
 *                       type: string
 *                       description: 사용자의 고유 ID
 *                       example: "3145587907"
 *                     social_provider:
 *                       type: string
 *                       description: 소셜 프로바이더 (카카오)
 *                       example: "kakao"
 *                     nickname:
 *                       type: string
 *                       description: 사용자 닉네임
 *                       example: "아아아"
 *                     profile_url:
 *                       type: string
 *                       description: 사용자 프로필 이미지 URL
 *                       example: "https://pds.joongang.co.kr/news/component/htmlphoto_mmdata/202306/25/488f9638-800c-4bac-ad65-82877fbff79b.jpg"
 *                     interested_area:
 *                       type: string
 *                       description: 관심 지역
 *                       example: "제주"
 *                     role:
 *                       type: string
 *                       description: 사용자 권한
 *                       example: "user"
 *                     state:
 *                       type: string
 *                       description: 가입 상태
 *                       example: "가입"
 *                     dibs:
 *                       type: array
 *                       description: 사용자가 저장한 항목
 *                     post:
 *                       type: array
 *                       description: 사용자 자유 게시물
 *                     promotion:
 *                       type: array
 *                       description: 사용자 홍보 게시물
 *                     comment:
 *                       type: array
 *                       description: 사용자가 작성한 댓글
 *                     review:
 *                       type: array
 *                       description: 사용자가 작성한 리뷰
 *                     __v:
 *                       type: number
 *                       description: 모델 버전
 *                       example: 0
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
 * /user/naver-login:
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
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: 사용자 ID
 *                       example: "654a8c722f0c32431d8cea87"
 *                     user_id:
 *                       type: string
 *                       description: 사용자의 고유 ID
 *                       example: "116217972498421836521"
 *                     social_provider:
 *                       type: string
 *                       description: 소셜 프로바이더 (네이버)
 *                       example: "naver"
 *                     nickname:
 *                       type: string
 *                       description: 사용자 닉네임
 *                       example: "은리"
 *                     profile_url:
 *                       type: string
 *                       description: 사용자 프로필 이미지 URL
 *                       example: "https://lh3.googleusercontent.com/a/ACg8ocIRQmkBmWmhRc6-jXQw-K28fA303nnLDaRQabv-rR_h3Ys=s96-c"
 *                     interested_area:
 *                       type: string
 *                       description: 관심 지역
 *                       example: "제주"
 *                     role:
 *                       type: string
 *                       description: 사용자 권한
 *                       example: "user"
 *                     state:
 *                       type: string
 *                       description: 가입 상태
 *                       example: "가입"
 *                     dibs:
 *                       type: array
 *                       description: 사용자가 저장한 항목
 *                     post:
 *                       type: array
 *                       description: 사용자 자유 게시물
 *                     promotion:
 *                       type: array
 *                       description: 사용자 홍보 게시물
 *                     comment:
 *                       type: array
 *                       description: 사용자가 작성한 댓글
 *                     review:
 *                       type: array
 *                       description: 사용자가 작성한 리뷰
 *                     __v:
 *                       type: number
 *                       description: 모델 버전
 *                       example: 0
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
 * /user/google-login:
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
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: 사용자 ID
 *                       example: "654a8c722f0c32431d8cea87"
 *                     user_id:
 *                       type: string
 *                       description: 사용자의 고유 ID
 *                       example: "116217972498421836521"
 *                     social_provider:
 *                       type: string
 *                       description: 소셜 프로바이더 (구글)
 *                       example: "google"
 *                     nickname:
 *                       type: string
 *                       description: 사용자 닉네임
 *                       example: "은리"
 *                     profile_url:
 *                       type: string
 *                       description: 사용자 프로필 이미지 URL
 *                       example: "https://lh3.googleusercontent.com/a/ACg8ocIRQmkBmWmhRc6-jXQw-K28fA303nnLDaRQabv-rR_h3Ys=s96-c"
 *                     interested_area:
 *                       type: string
 *                       description: 관심 지역
 *                       example: "제주"
 *                     role:
 *                       type: string
 *                       description: 사용자 권한
 *                       example: "user"
 *                     state:
 *                       type: string
 *                       description: 가입 상태
 *                       example: "가입"
 *                     dibs:
 *                       type: array
 *                       description: 사용자가 저장한 항목
 *                     post:
 *                       type: array
 *                       description: 사용자 자유 게시물
 *                     promotion:
 *                       type: array
 *                       description: 사용자 홍보 게시물
 *                     comment:
 *                       type: array
 *                       description: 사용자가 작성한 댓글
 *                     review:
 *                       type: array
 *                       description: 사용자가 작성한 리뷰
 *                     __v:
 *                       type: number
 *                       description: 모델 버전
 *                       example: 0
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
 * /user/logout:
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
 * /user/check-login:
 *   get:
 *     tags: [user]
 *     summary: 사용자 로그인상태 확인
 *     responses:
 *       200:
 *         description: 로그인 true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isLoggedIn:
 *                   type: boolean
 *                   description: Description of the property
 *                   example: true
 *                 user:
 *                   properties:
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
 */
/**
 * @swagger
 * /user:
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
 * /user:
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
 *                 description: Description of the property
 *                 example: "3145587907"
 *               social_provider:
 *                 type: string
 *                 description: Description of the property
 *                 example: "kakao"
 *               nickname:
 *                 type: string
 *                 description: Description of the property
 *                 example: "햄거버"
 *               profile_url:
 *                 type: string
 *                 description: Description of the property
 *                 example: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYKwevKgJs666_yQmbkZLzlCBL-G2tmqOaHg&usqp=CAU"
 *               interested_area:
 *                 type: string
 *                 description: Description of the property
 *                 example: "서울"
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
 *                       example: "햄거버"
 *                     profile_url:
 *                       type: string
 *                       description: Description of the property
 *                       example: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYKwevKgJs666_yQmbkZLzlCBL-G2tmqOaHg&usqp=CAU"
 *                     interested_area:
 *                       type: string
 *                       description: Description of the property
 *                       example: "서울"
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
 * /user:
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
 * /user/admin/users:
 *   get:
 *     tags: [user]
 *     summary: 관리자 전체 회원 조회
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
 *                   example:
 *                     - user_id: "3145587907"
 *                       social_provider: "kakao"
 *                       nickname: "아아아"
 *                       profile_url: "https://pds.joongang.co.kr/news/component/htmlphoto_mmdata/202306/25/488f9638-800c-4bac-ad65-82877fbff79b.jpg"
 *                       interested_area: "제주"
 *                       role: "user"
 *                       state: "가입"
 *                     - user_id: "0000000000"
 *                       social_provider: "kakao"
 *                       nickname: "햄거버"
 *                       profile_url: "https://pds.joongang.co.kr/news/component/htmlphoto_mmdata/202306/25/488f9638-800c-4bac-ad65-82877fbff79b.jpg"
 *                       interested_area: "제주"
 *                       role: "user"
 *                       state: "가입"
 *                     - user_id: "0000000000"
 *                       social_provider: "kakao"
 *                       nickname: "햄거버"
 *                       profile_url: "https://pds.joongang.co.kr/news/component/htmlphoto_mmdata/202306/25/488f9638-800c-4bac-ad65-82877fbff79b.jpg"
 *                       interested_area: "제주"
 *                       role: "user"
 *                       state: "가입"
 *
 */
router.post(
  "/register",
  validationMiddleware(UserRequestDTO),
  asyncHandler(UserController.RegisterUser),
);
router.post("/check-nickname", asyncHandler(UserController.checkNickname));
router.post("/kakao-login", asyncHandler(UserController.kakaoLogin));
router.post("/naver-login", asyncHandler(UserController.naverLogin));
router.post("/google-login", asyncHandler(UserController.googleLogin));
router.post("/logout", asyncHandler(UserController.logout));
router.get("/check-login", checkLoginStatus);
router.get("/", authenticateUser, asyncHandler(UserController.getUser));
router.put("/", authenticateUser, asyncHandler(UserController.updateUser));
router.delete("/", authenticateUser, asyncHandler(UserController.deleteUser));
router.get(
  "/bookmarks",
  authenticateUser,
  asyncHandler(UserController.getBookmarks),
);
router.get(
  "/is-bookmarked/:showId",
  authenticateUser,
  asyncHandler(UserController.isBookmarked),
);
router.put(
  "/save/:showId",
  authenticateUser,
  asyncHandler(UserController.saveShow),
);
router.put(
  "/cancel/:showId",
  authenticateUser,
  asyncHandler(UserController.cancelShow),
);
router.put(
  "/cancels/bookmarks",
  authenticateUser,
  asyncHandler(UserController.cancelBookmarks),
);
router.get(
  "/admin/users",
  authenticateAdmin,
  asyncHandler(UserController.getAllUsers),
);

export default router;
