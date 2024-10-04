import bcryptjs from "bcryptjs";
import { User } from "../models/user.model.mjs";
import { generateVerificationToken } from "../utils/generateVerificationToken.mjs";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.mjs";

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
export const login = async (req, res) => {
  res.send("login routes");
};
export const logout = async (req, res) => {
  res.send("logout routes");
};
