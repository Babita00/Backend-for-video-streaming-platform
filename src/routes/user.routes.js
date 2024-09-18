import { Router } from "express";
import { registerUser } from "../UserController/user.register.js";
import { upload } from "../middlewares/multer.middleware.js";
import { loginUser } from "../UserController/user.login.js";
import { logoutUser } from "../UserController/user.logout.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { changeCurrentPassword } from "../UserController/changePassword.js";
import { updateAccountDetails } from "../UserController/updateAccountDetails.js";
import { getUserChannelProfile } from "../UserController/getChannelProfile.js";
import { getWatchHistory } from "../UserController/WatchHistory.js";
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
router.route("/change-password").post(changeCurrentPassword);
router.route("/update-account").patch(verifyJwt, updateAccountDetails);
router.route("/c/:username").get(getUserChannelProfile);
router.route("/history").get(verifyJwt, getWatchHistory);
export default router;
