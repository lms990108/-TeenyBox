import express from "express";
import UserController from "../controllers/userController";
import {
  checkLoginStatus,
  authenticateUser,
  authenticateAdmin,
} from "../middlewares/authUserMiddlewares";

const router = express.Router();

router.post("/register", UserController.RegisterUser);
router.post("/check-nickname", UserController.checkNickname);
router.post("/kakao-login", UserController.kakaoLogin);
router.post("/logout", UserController.logout);
router.get("/check-login", checkLoginStatus);
router.get("/", authenticateUser, UserController.getUser);
router.put("/", authenticateUser, UserController.updateUser);
router.delete("/", authenticateUser, UserController.deleteUser);
router.get("/admin/users", authenticateAdmin, UserController.getAllUsers);

export default router;
