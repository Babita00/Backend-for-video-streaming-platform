import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/APIerror.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinaryService.js";
import { ApiResponse } from "../utils/apiResponse.js";

//user registration
const registerUser = asyncHandler(async (req, res) => {
  //get user field
  const { fullname, email, username, password } = req.body;

  //validation

  if (
    [fullname, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw ApiError(400, "All field are required");
  }

  //user already exist??
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  console.log("esisted user is:", existedUser);
  if (existedUser) {
    throw ApiError(409, "User with email or username aalready exist");
  }
  //check images
  const avatarLocalPath = req.files?.avatar?.path;
  console.log(avatarLocalPath);

  const coverImageLocalPath = req.files?.coverImage?.path;
  console.log(coverImageLocalPath);

  // if (!avatarLocalPath) {
  //   throw new ApiError(400, "Avater File is required");
  // }

  //upload them to cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  // if (!avatar) {
  //   throw new ApiError(400, "Avater File is required");
  // }

  //make an object

  const user = await User.create({
    fullname,
    avatar: avatar?.url || " ",
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });
  const userCreated = await User.findById(user._id).select(
    "-password -refrehToken"
  );
  if (!userCreated) {
    throw new ApiError(400, "Error occured while registration");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, userCreated, "User registered successfully"));
});
export { registerUser };
