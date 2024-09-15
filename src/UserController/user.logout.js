import { asyncHandler } from "../utils/asyncHandler";
import { User } from "../models/user.model.js";

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { $set: { refreshToken: undefined } },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  res.clearCookie("token", options); // Clear the token cookie
  res.status(200).json({ message: "User logged out successfully" }); // Send response
});

export { logoutUser };
