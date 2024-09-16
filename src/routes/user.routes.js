import { Router } from "express";
import { registerUser } from "../UserController/user.register.js";
import { upload } from "../middlewares/multer.middleware.js";
import { loginUser } from "../UserController/user.login.js";
import { logoutUser } from "../UserController/user.logout.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar", //same in frontend as well
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post(loginUser);
router.route("/logout").post(verifyJwt, logoutUser);

export default router;
