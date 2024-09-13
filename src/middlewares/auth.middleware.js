import { ApiError } from "../utils/APIerror";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken";
export const verifyJwt = asyncHandler(async (req, res, next) => {
  const Token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer", "");
  if (!Token) {
    throw new ApiError(401, "Unauthorized request");
  }
  jwt.verify(Token, process.env.accessToken);
});
