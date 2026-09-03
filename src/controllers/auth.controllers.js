// query the user model from the db
import { User } from "../models/user.models.js";
//utils
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { sendEmail } from "../utils/sendEmail.js";
// generate access token and refresh token
const generateTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAT();
    const refreshToken = user.generateRT();
    // rewrite the refresh token in the mongooge document ie object in local memory
    user.refreshToken = refreshToken;
    // updating the real document in db 
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new apiError(500, "Something went wrong while generating tokens");
  }

  //   const accessToken = User.generateAT(userId);
  //   const refreshToken = User.generateRT(userId);
  //   return { accessToken, refreshToken };
};

// method to register a new user
const registerUser = asyncHandler(async (req, res) => {
  // data comes from frontend via body , header , params(url)
  const { username, email, password } = req.body; // destructuring the data from the request body

  // validate the data

  // check if the user already exists
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });

  if (existingUser) {
    throw new apiError(400, "User already exists");
  }

  // else create a new user
  const user = await User.create({
    username,
    email,
    password,
    isEmailVerified: false,
  });

  //user and User are diff

  // need to use the same property name
  const { unhashedtoken, hashedToken, tokenExpiry } =
    user.generateTemperoryToken();

  user.emailVerificationToken = hashedToken;
  user.emailVerificationTokenExpiry = tokenExpiry;
  await user.save({ validateBeforeSave: false });

  // send the email verification link to the user RESPONSE
  await sendEmail({
    to: user?.email,
    subject: "Verify your email",
    mailgencontent: emailVerficationMailGeneratorContent(
      user.username,
      `${req.protocol}://${req.get("host")}/api/v1/auth/verify-email/${unhashedtoken}`,
    ),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken -emailVerificationToken -emailVerificationTokenExpiry",
  );

  if (!createdUser) {
    throw new apiError(500, "Something went wrong while fetching the user");
  }

  // send the email verification link to the user RESPONSE
  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        "User registered successfully and Verification email sent",
        { user: createdUser },
      ),
    );
});

export { registerUser };
