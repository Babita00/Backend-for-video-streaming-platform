import { Router } from "express";
import { registerUser } from "../UserController/user.register.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar", //same in frontend as well
      maxCount: 1,
    },
    {
      name: "coverImage",
      macCount: 1,
    },
  ]),
  registerUser
);

export default router;
