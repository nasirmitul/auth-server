import bcryptjs from "bcryptjs";
import { User } from "../models/user.model.mjs";
import { generateVerificationToken } from "../utils/generateVerificationToken.mjs";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.mjs";
import { sendVerificationEmail, sendWelcomeEmail } from "../email/emails.mjs";

// signup user
export const signup = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    if (!email || !password || !name) {
      throw new Error("All fields are required");
    }

    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
      return res
        .status(403)
        .json({ success: false, message: "User Already Exists" });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const verificationToken = generateVerificationToken();
    const user = new User({
      email,
      password: hashedPassword,
      name,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });

    await user.save();

    // jwt validation
    generateTokenAndSetCookie(res, user._id);

    // send verification email
    await sendVerificationEmail(user.email, verificationToken);

    //sending response
    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

// verify user
export const verifyEmail = async (req, res) => {
  const { code } = req.body;
  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }

    user.isVerified = true;

    await user.save();

    await sendWelcomeEmail(user.email, user.name);

    res.sendStatus(200).json({
      success: true,
      message: "Email verified successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("Error in verify email", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// login user
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // checking user if exist
    const user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    // checking if the password is valid or not
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "passwords do not match" });
    }

    // allowing access
    generateTokenAndSetCookie(res, user._id);
    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Logged in successfully ",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("Error in login function", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// user forget password
export const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged out successfully" });
};
