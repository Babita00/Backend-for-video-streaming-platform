import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullname: {
      type: String,
      required: true,
    },
    avatar: {
      type: String, //cloudnary url
      required: true,
    },
    coverImage: {
      type: String, //cloudnary url
    },
    watchHistory: [
      {
        type: mongoose.Types.ObjectId,
        ref: "video",
      },
    ],
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refrehToken: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) return next(); //password change bhaye matra yo field change garnu

  this.password = await bcrypt.hash(this.password, 10);
  next();
}); //this is taken from documentation of mongoose in middleware

//checking if password is correct
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  try {
    // 'this' refers to the current user instance
    const token = jwt.sign(
      { _id: this._id, email: this.email, username: this.username },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
      }
    );
    return token;
  } catch (error) {
    console.error("Error generating access token:", error);
    throw error;
  }
};
userSchema.methods.generateRefreshToken = async function () {
  try {
    // 'this' refers to the current user instance
    const token = jwt.sign(
      { _id: this._id },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
      }
    );
    return token;
  } catch (error) {
    console.error("Error generating access token:", error);
    throw error;
  }
};
export const User = mongoose.model("User", userSchema);
