import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/apiResponse";

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullname, username, email } = req.body;

  if (!fullname || !email || !username) {
    throw new ApiError(400, "All fields are required");
  }
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullname: fullname,
        email: email,
        username: username,
      },
    },
    { new: true }
  ).select("-password ");
  return res
    .status(200)
    .json(new ApiResponse(200, "Account details updated successfully"));
});

export { updateAccountDetails };
