import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  console.log('Cookies:', req.cookies); // Debugging statement
  const token = req.cookies.token;
  console.log('token', token);
  
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized - no token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized - invalid token" });
    }

    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.log(`Error in verifying token: ${error}`);
    return res.status(500).json({ success: false, message: "Server error " });
  }
};
