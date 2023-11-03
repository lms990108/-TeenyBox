import express from "express";
import UserController from "../controllers/userController";
import {
  checkLoginStatus,
  authenticateUser,
  authenticateAdmin,
} from "../middlewares/authUserMiddlewares";
import { UserRequestDTO } from "../dtos/userDto";
import { validationMiddleware } from "../middlewares/validationMiddleware";

const router = express.Router();

router.post(
  "/register",
  validationMiddleware(UserRequestDTO),
  UserController.RegisterUser,
);
router.post("/check-nickname", UserController.checkNickname);
router.post("/kakao-login", UserController.kakaoLogin);
router.post("/logout", UserController.logout);
router.get("/check-login", checkLoginStatus);
router.get("/", authenticateUser, UserController.getUser);
router.put("/", authenticateUser, UserController.updateUser);
router.delete("/", authenticateUser, UserController.deleteUser);
router.get("/admin/users", authenticateAdmin, UserController.getAllUsers);

export default router;
