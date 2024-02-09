import express from "express";
import asyncHandler from "../common/utils/asyncHandler";
import commentController from "../controllers/commentController";
import { validationMiddleware } from "../middlewares/validationMiddleware";
import * as commentDto from "../dtos/commentDto";
import {
  authenticateAdmin,
  authenticateUser,
} from "../middlewares/authUserMiddlewares";

const router = express.Router();

/**
 * @swagger
 * /comments:
 *   post:
 *     tags: [comment]
 *     summary: 댓글 생성
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: 댓글 내용
 *                 example: "이 댓글은 테스트입니다."
 *               post:
 *                 type: string
 *                 description: 게시글 ID (Optional)
 *                 example: "61576b28b4f03f08f95317cb"
 *               promotion:
 *                 type: string
 *                 description: 홍보 게시글 ID (Optional)
 *                 example: "61576b28b4f03f08f95317cc"
 *     responses:
 *       '201':
 *         description: 새로운 댓글이 성공적으로 생성되었음을 나타냄
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: 댓글 ID
 *                   example: "61576b28b4f03f08f95317ca"
 *                 content:
 *                   type: string
 *                   description: 댓글 내용
 *                   example: "이 댓글은 테스트입니다."
 *                 user_id:
 *                   type: string
 *                   description: 사용자 ID
 *                   example: "61576b28b4f03f08f95317cd"
 *                 user_nickname:
 *                   type: string
 *                   description: 사용자 닉네임
 *                   example: "john_doe"
 *                 user_profile_url:
 *                   type: string
 *                   description: 사용자 프로필 url
 *                   example: "https://elice-5th.s3.amazonaws.com/users/1706709450528_KakaoTalk_Photo_2023-08-25-20-53-41 003.jpeg"
 *                 post:
 *                   type: string
 *                   description: 게시글 ID
 *                   example: "61576b28b4f03f08f95317cb"
 *                 promotion:
 *                   type: string
 *                   description: 홍보 게시글 ID
 *                   example: "61576b28b4f03f08f95317cc"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: 댓글 생성 일시
 *                   example: "2023-10-01T12:34:56.789Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   description: 댓글 수정 일시
 *                   example: "2023-10-01T12:34:56.789Z"
 *       '500':
 *         description: 서버 오류. 댓글 생성에 실패했음을 나타냄
 */
/**
 * @swagger
 * /comments/posts/{postId}:
 *   get:
 *     tags: [comment]
 *     summary: 게시글 아이디로 모든 댓글 조회 (페이징 처리)
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: 조회할 게시글의 ID
 *         example: "61576b28b4f03f08f95317cb"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: |
 *           페이지 번호 (기본값: 1)
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: |
 *           한 페이지에 표시할 댓글 수 (기본값: 20)
 *         example: 20
 *     responses:
 *       '200':
 *         description: 성공적으로 댓글을 가져왔을 때 반환되는 응답 (post or promotion)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 comments:
 *                   type: array
 *                   description: 게시글에 대한 댓글 목록
 *                   items:
 *                     type: object
 *                     properties:
 *                       content:
 *                         type: string
 *                         description: 댓글 내용
 *                         example: "이 게시글 정말 유익합니다."
 *                       user_id:
 *                         type: string
 *                         description: 사용자 ID
 *                         example: "61576b28b4f03f08f95317ca"
 *                       user_nickname:
 *                         type: string
 *                         description: 사용자 닉네임
 *                         example: "user123"
 *                       user_profile_url:
 *                         type: string
 *                         description: 사용자 프로필 url
 *                         example: "https://elice-5th.s3.amazonaws.com/users/1706709450528_KakaoTalk_Photo_2023-08-25-20-53-41 003.jpeg"
 *                       post:
 *                         type: string
 *                         description: 게시글 ID
 *                         example: "61576b28b4f03f08f95317cb"
 *                       promotion:
 *                         type: string
 *                         description: 홍보 게시글 ID
 *                         example: "61576b28b4f03f08f95317cc"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: 댓글 작성일시
 *                         example: "2024-01-30T12:00:00.000Z"
 *                 totalComments:
 *                   type: integer
 *                   description: 게시글에 대한 전체 댓글 수
 *                   example: 35
 *       '404':
 *         description: 요청한 게시글이 존재하지 않을 때 반환되는 응답
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: 오류 메시지
 *                   example: "게시글을 찾을 수 없습니다."
 *       '500':
 *         description: 서버 오류가 발생했을 때 반환되는 응답
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: 오류 메시지
 *                   example: "게시글에 대한 댓글을 가져오는데 실패했습니다."
 */
/**
 * @swagger
 * /comments/promotions/{promotionId}:
 *   get:
 *     tags: [comment]
 *     summary: 홍보 게시글 아이디로 모든 댓글 조회 (페이징 처리)
 *     parameters:
 *       - in: path
 *         name: promotionId
 *         required: true
 *         schema:
 *           type: string
 *         description: 조회할 홍보 게시글의 ID
 *         example: "61576b28b4f03f08f95317cc"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: |
 *           페이지 번호 (기본값: 1)
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: |
 *           한 페이지에 표시할 댓글 수 (기본값: 20)
 *         example: 20
 *     responses:
 *       '200':
 *         description: 성공적으로 댓글을 가져왔을 때 반환되는 응답 (post or promotion)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 comments:
 *                   type: array
 *                   description: 홍보 게시글에 대한 댓글 목록
 *                   items:
 *                     type: object
 *                     properties:
 *                       content:
 *                         type: string
 *                         description: 댓글 내용
 *                         example: "이 게시글 정말 유익합니다."
 *                       user_id:
 *                         type: string
 *                         description: 사용자 ID
 *                         example: "61576b28b4f03f08f95317ca"
 *                       user_nickname:
 *                         type: string
 *                         description: 사용자 닉네임
 *                         example: "user123"
 *                       user_profile_url:
 *                         type: string
 *                         description: 사용자 프로필 url
 *                         example: "https://elice-5th.s3.amazonaws.com/users/1706709450528_KakaoTalk_Photo_2023-08-25-20-53-41 003.jpeg"
 *                       post:
 *                         type: string
 *                         description: 게시글 ID
 *                         example: "61576b28b4f03f08f95317cb"
 *                       promotion:
 *                         type: string
 *                         description: 홍보 게시글 ID
 *                         example: "61576b28b4f03f08f95317cc"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: 댓글 작성일시
 *                         example: "2024-01-30T12:00:00.000Z"
 *                 totalComments:
 *                   type: integer
 *                   description: 홍보 게시글에 대한 전체 댓글 수
 *                   example: 15
 *       '404':
 *         description: 요청한 홍보 게시글이 존재하지 않을 때 반환되는 응답
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: 오류 메시지
 *                   example: "홍보 게시글을 찾을 수 없습니다."
 *       '500':
 *         description: 서버 오류가 발생했을 때 반환되는 응답
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: 오류 메시지
 *                   example: "홍보 게시글에 대한 댓글을 가져오는데 실패했습니다."
 */
/**
 * @swagger
 * /comments/users:
 *   get:
 *     tags: [comment]
 *     summary: 특정 사용자가 작성한 모든 댓글 조회 (페이징 처리)
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: |
 *           페이지 번호 (기본값: 1)
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: |
 *           한 페이지에 표시할 댓글 수 (기본값: 20)
 *         example: 20
 *     responses:
 *       '200':
 *         description: 성공적으로 댓글을 가져왔을 때 반환되는 응답
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 comments:
 *                   type: array
 *                   description: 사용자가 작성한 댓글 목록
 *                   items:
 *                     type: object
 *                     properties:
 *                       content:
 *                         type: string
 *                         description: 댓글 내용
 *                         example: "이 댓글은 사용자가 작성한 내용입니다."
 *                       user_id:
 *                         type: string
 *                         description: 댓글 작성자의 ID
 *                         example: "61576b28b4f03f08f95317ca"
 *                       user_nickname:
 *                         type: string
 *                         description: 댓글 작성자의 닉네임
 *                         example: "user123"
 *                       user_profile_url:
 *                         type: string
 *                         description: 사용자 프로필 url
 *                         example: "https://elice-5th.s3.amazonaws.com/users/1706709450528_KakaoTalk_Photo_2023-08-25-20-53-41 003.jpeg"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: 댓글 작성일
 *                         example: "2023-12-30T12:34:56.789Z"
 *                 totalComments:
 *                   type: integer
 *                   description: 사용자가 작성한 전체 댓글 수
 *                   example: 25
 *       '500':
 *         description: 서버 오류가 발생했을 때 반환되는 응답
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: 오류 메시지
 *                   example: "사용자에 대한 댓글을 가져오는데 실패했습니다."
 */
/**
 * @swagger
 * /comments/{commentId}:
 *   put:
 *     tags: [comment]
 *     summary: 댓글 수정
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: 수정할 댓글의 ID
 *         example: "61576b28b4f03f08f95317cc"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: 수정할 댓글의 내용
 *                 example: "Updated comment content"
 *     responses:
 *       '200':
 *         description: 댓글 수정이 성공했을 때 반환되는 응답
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 content:
 *                   type: string
 *                   description: 수정된 댓글 내용
 *                   example: "Updated comment content"
 *                 user_id:
 *                   type: string
 *                   description: 댓글 작성자의 ID
 *                   example: "61576b28b4f03f08f95317ca"
 *                 user_nickname:
 *                   type: string
 *                   description: 댓글 작성자의 닉네임
 *                   example: "user123"
 *                 user_profile_url:
 *                   type: string
 *                   description: 사용자 프로필 url
 *                   example: "https://elice-5th.s3.amazonaws.com/users/1706709450528_KakaoTalk_Photo_2023-08-25-20-53-41 003.jpeg"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: 댓글 작성일
 *                   example: "2023-12-30T12:34:56.789Z"
 *       '400':
 *         description: 사용자 ID와 댓글 소유자 ID가 일치하지 않을 때 반환되는 응답
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: 오류 메시지
 *                   example: "사용자 ID와 댓글 소유자 ID가 일치하지 않습니다."
 *       '404':
 *         description: 요청한 댓글이 존재하지 않을 때 반환되는 응답
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: 오류 메시지
 *                   example: "댓글을 찾을 수 없습니다."
 *       '500':
 *         description: 서버 오류가 발생했을 때 반환되는 응답
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: 오류 메시지
 *                   example: "댓글을 수정하는데 실패했습니다."
 */
/**
 * @swagger
 * /comments/{commentId}:
 *   delete:
 *     tags: [comment]
 *     summary: 댓글 삭제
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: 삭제할 댓글의 ID
 *         example: "61576b28b4f03f08f95317cc"
 *     responses:
 *       '200':
 *         description: 댓글 삭제가 성공했을 때 반환되는 응답
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: 성공 메시지
 *                   example: "댓글이 삭제되었습니다."
 *       '400':
 *         description: 사용자 ID와 댓글 소유자 ID가 일치하지 않을 때 반환되는 응답
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: 오류 메시지
 *                   example: "사용자 ID와 댓글 소유자 ID가 일치하지 않습니다."
 *       '500':
 *         description: 서버 오류가 발생했을 때 반환되는 응답
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: 오류 메시지
 *                   example: "댓글을 삭제하는데 실패했습니다."
 */
/**
 * @swagger
 * /comments:
 *   delete:
 *     tags: [comment]
 *     summary: 선택 댓글 삭제 (마이페이지)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               commentIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: 삭제할 댓글의 ID 목록
 *           example:
 *             commentIds: ["61576b28b4f03f08f95317cc", "61576b28b4f03f08f95317cd"]
 *     responses:
 *       '200':
 *         description: 댓글 삭제가 성공했을 때 반환되는 응답
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: 성공 메시지
 *                   example: "댓글이 삭제되었습니다."
 *       '400':
 *         description: 사용자 ID와 댓글 소유자 ID가 일치하지 않을 때 반환되는 응답
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: 오류 메시지
 *                   example: "사용자 ID와 댓글 소유자 ID가 일치하지 않습니다."
 *       '500':
 *         description: 서버 오류가 발생했을 때 반환되는 응답
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: 오류 메시지
 *                   example: "댓글 삭제 중 오류가 발생했습니다."
 */
/**
 * @swagger
 * /comments/admins/posts:
 *   get:
 *     tags: [comment]
 *     summary: 자유게시판 모든 댓글 조회 (페이징 처리) (관리자페이지)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: |
 *           페이지 번호 (기본값: 1)
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: |
 *           한 페이지에 표시할 댓글 수 (기본값: 20)
 *         example: 20
 *     responses:
 *       '200':
 *         description: 성공적으로 모든 댓글을 가져온 경우 반환되는 응답
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 comments:
 *                   type: array
 *                   description: 모든 댓글 목록
 *                   items:
 *                     type: object
 *                     properties:
 *                       content:
 *                         type: string
 *                         description: 댓글 내용
 *                       user_id:
 *                         type: string
 *                         description: 작성자의 사용자 ID
 *                       user_nickname:
 *                         type: string
 *                         description: 작성자의 닉네임
 *                       user_profile_url:
 *                         type: string
 *                         description: 사용자 프로필 url
 *                       post:
 *                         type: string
 *                         description: 댓글이 작성된 게시글의 ID
 *                       promotion:
 *                         type: string
 *                         description: 댓글이 작성된 홍보 게시글의 ID
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: 댓글 작성일
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         description: 댓글 수정일
 *                 totalComments:
 *                   type: integer
 *                   description: 전체 댓글 수
 *                   example: 100
 *       '500':
 *         description: 서버 오류가 발생했을 때 반환되는 응답
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: 오류 메시지
 *                   example: "댓글을 가져오는 도중 오류가 발생했습니다."
 */
/**
 * @swagger
 * /comments/admins/promotions:
 *   get:
 *     tags: [comment]
 *     summary: 홍보게시판 모든 댓글 조회 (페이징 처리) (관리자페이지)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: |
 *           페이지 번호 (기본값: 1)
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: |
 *           한 페이지에 표시할 댓글 수 (기본값: 20)
 *         example: 20
 *     responses:
 *       '200':
 *         description: 성공적으로 모든 댓글을 가져온 경우 반환되는 응답
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 comments:
 *                   type: array
 *                   description: 모든 댓글 목록
 *                   items:
 *                     type: object
 *                     properties:
 *                       content:
 *                         type: string
 *                         description: 댓글 내용
 *                       user_id:
 *                         type: string
 *                         description: 작성자의 사용자 ID
 *                       user_nickname:
 *                         type: string
 *                         description: 작성자의 닉네임
 *                       user_profile_url:
 *                         type: string
 *                         description: 사용자 프로필 url
 *                       post:
 *                         type: string
 *                         description: 댓글이 작성된 게시글의 ID
 *                       promotion:
 *                         type: string
 *                         description: 댓글이 작성된 홍보 게시글의 ID
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: 댓글 작성일
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         description: 댓글 수정일
 *                 totalComments:
 *                   type: integer
 *                   description: 전체 댓글 수
 *                   example: 100
 *       '500':
 *         description: 서버 오류가 발생했을 때 반환되는 응답
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: 오류 메시지
 *                   example: "댓글을 가져오는 도중 오류가 발생했습니다."
 */
/**
 * @swagger
 * /comments/admins/comments:
 *   delete:
 *     tags: [comment]
 *     summary: 선택 댓글 삭제 (관리자페이지)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               commentIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: 삭제할 댓글의 ID 목록
 *           example:
 *             commentIds: ["61576b28b4f03f08f95317cc", "61576b28b4f03f08f95317cd"]
 *     responses:
 *       '200':
 *         description: 댓글 삭제가 성공했을 때 반환되는 응답
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: 성공 메시지
 *                   example: "댓글이 삭제되었습니다."
 *       '500':
 *         description: 서버 오류가 발생했을 때 반환되는 응답
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: 오류 메시지
 *                   example: "댓글 삭제 중 오류가 발생했습니다."
 */

// 댓글 생성
router.post(
  "/",
  authenticateUser,
  validationMiddleware(commentDto.CreateCommentDTO),
  asyncHandler(commentController.createComment),
);

// 특정 게시글의 모든 댓글 조회 (페이징 처리)
router.get(
  "/posts/:postId",
  asyncHandler(commentController.getCommentsByPostId),
);

// 특정 홍보 게시글의 모든 댓글 조회 (페이징 처리)
router.get(
  "/promotions/:promotionId",
  asyncHandler(commentController.getCommentsByPromotionId),
);

// 특정 사용자가 작성한 모든 댓글 조회 (페이징 처리)
router.get(
  "/users",
  authenticateUser,
  asyncHandler(commentController.getCommentsByUserId),
);

// 댓글 수정
router.put(
  "/:commentId",
  authenticateUser,
  validationMiddleware(commentDto.UpdateCommentDTO),
  asyncHandler(commentController.updateComment),
);

// 댓글 삭제
router.delete(
  "/:commentId",
  authenticateUser,
  asyncHandler(commentController.deleteComment),
);

// 선택 댓글 삭제 (마이페이지)
router.delete(
  "/",
  authenticateUser,
  asyncHandler(commentController.deleteComments),
);

/* 관리자페이지 */

// 자유게시판 모든 댓글 조회 (페이징 처리)
router.get("/admins/posts", asyncHandler(commentController.getAllComments));

// 홍보게시판 모든 댓글 조회 (페이징 처리)
router.get(
  "/admins/promotions",
  asyncHandler(commentController.getAllPromotionComments),
);

// 선택 댓글 삭제 (관리자페이지)
router.delete(
  "/admins/comments",
  authenticateAdmin,
  asyncHandler(commentController.deleteCommentsByAdmin),
);

export default router;
