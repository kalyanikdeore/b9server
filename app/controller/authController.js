const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Token = require("../models/tokenModel");
const bcrypt = require("bcrypt");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/tokenUtils");

exports.signup = async (req, res) => {
  try {
    const { username, email, password, gender, phone, dob, city } = req.body;

    console.log("Received signup data:", req.body);

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      console.log("Signup error: Email already exists");
      return res.status(400).json({ error: "Email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Password hashed successfully");

    // Create new user
    const user = await User.create({
      username,
      email,
      gender,
      phone: phone.toString(),
      dob: new Date(dob),
      city,
      password: hashedPassword,
      role: "user", // hardcoded role
    });

    console.log("New user created:", user.email);

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    console.log("Tokens generated");

    // Save refresh token in DB
    await Token.create({
      userId: user.id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    // Set cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Success response
    res.status(201).json({
      success: true,
      message: "User created and logged in successfully",
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    const user = await User.findOne({ where: { email } });

    console.log(user.password);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    console.log(accessToken, refreshToken);
    await Token.destroy({ where: { userId: user.id } }); // Invalidate old refresh tokens
    await Token.create({
      userId: user.id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    const { password: _password, ...userWithoutPassword } = user.get({
      plain: true,
    });

    res.json({
      success: true,
      user: userWithoutPassword,
      message: "Logged in successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken)
      return res.status(401).json({ error: "No refresh token provided" });

    const tokenData = await Token.findOne({ where: { token: refreshToken } });
    if (!tokenData || tokenData.expiresAt < new Date())
      return res
        .status(401)
        .json({ error: "Invalid or expired refresh token" });

    const user = await User.findByPk(tokenData.userId);
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    await Token.destroy({ where: { token: refreshToken } }); // Rotate refresh token
    await Token.create({
      userId: user.id,
      token: newRefreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    setAuthCookies(res, newAccessToken, newRefreshToken);

    res.json({ message: "Token refreshed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken)
      return res.status(400).json({ error: "No refresh token provided" });

    await Token.destroy({ where: { token: refreshToken } });

    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getEmp = async (req, res) => {
  try {
    // console.log(req);
    const { accessToken } = req.cookies;
    if (!accessToken)
      return res.status(401).json({ error: "No token provided" });

    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findByPk(decoded.id, {
      attributes: [
        "id",
        "username",
        "phone",
        "dob",
        "gender",
        "city",
        "email",
        "role",
      ],
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ user });
  } catch (error) {
    res.status(401).json({ error: "Unauthorized" });
  }
};
// Helper function to set cookies
const setAuthCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};
