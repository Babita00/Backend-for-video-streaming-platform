import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/APIerror.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/apiResponse.js";

//user login
const loginUser = asyncHandler(async (req, res) => {
  //get data from user
  const { email, username, password } = req.body;

  //user or email id required
  if (!username || !email) {
    throw new ApiError(400, "username or email is required");
  }

  //find user from database
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (!user) {
    throw new ApiError(400, "user does not exist");
  }

  //check user password
  const validPassword = await user.isPasswordCorrect(password);
  if (!validPassword) {
    throw new ApiError(401, "Invalid password");
  }

  //assign access and refresh token
  const generateAccessAndRefereshTokens = async (userId) => {
    try {
      const user = await User.findById(userId);

      //generate access and refresh token
      const accessToken = user.generateAccessToken();
      const refreshToken = user.generateRefreshToken();

      //add to database
      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });

      return { accessToken, refreshToken };
    } catch (error) {
      throw new ApiError(
        500,
        "Something went wrong while generating referesh and access token"
      );
    }
  };

  await generateAccessAndRefereshTokens(user._id);
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  //send cookies

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("Access Token", accessToken, Option)
    .cookie("Refresh Token", refreshToken, Option)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User logged in successfully"
      )
    );
});

export { loginUser };
