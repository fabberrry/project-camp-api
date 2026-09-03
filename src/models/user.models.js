import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
const userSchema = new Schema(
  {
    avatar: {
      type: {
        url: String,
        localPath: String,
      },
      default: {
        url: "https://placehold.co/100x100",
        localPath: "", // cuz we not storing the image in local storage, we can leave it empty
      },
    },
    username: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
      lowercase: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
    },
    forgotPasswordToken: {
      type: String,
    },
    forgotPasswordTokenExpiry: {
      type: Date,
    },
    emailVerificationToken: {
      type: String,
    },
    emailVerificationTokenExpiry: {
      type: Date,
    },
  },
  { timestamps: true },
);
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAT = function () {
  return jwt.sign(
    {
      _id: this._id, // payload
      email: this.email, // payload
      username: this.username, // payload
    },
    process.env.ACCESS_TOKEN_SECRET, // secret key
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
    },
  );
};
userSchema.methods.generateRT = function () {
  return jwt.sign(
    {
      _id: this._id, // payload
      email: this.email, // payload
      username: this.username, // payload
    },
    process.env.REFRESH_TOKEN_SECRET, // secret key
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRATION,
    },
  );
};

// temperory token for email verification and forgot password
userSchema.methods.generateTemperoryToken = function () {
  const unhashedtoken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(unhashedtoken)
    .digest("hex");
  // where sha256 is the hashing algorithm,
  // update() is used to update the hash with the unhashed token, and digest() is used to get the final hashed value in hexadecimal format.

  //token expiry
  const tokenExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes from now
  // return all the values
  return {
    unhashedtoken,
    hashedToken,
    tokenExpiry,
  };
};

export const User = mongoose.model("User", userSchema);
