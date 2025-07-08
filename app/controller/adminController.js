const Token = require("../models/tokenModel");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/tokenUtils");

exports.signup = async (req, res) => {
  try {
    //
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(req.body);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      
      role: "admin",
    });
    res.status(201).json({
      success: true,
      message: "Admin user created and logged in successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// User Login flow
exports.login = async (req, res) => {
  try {
    console.log(req.body);

    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    console.log(user);
    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }

    if (user.status === "inactive") {
      return res
        .status(403)
        .json({ error: "user is inactive. Contact admin." });
    }

    console.log(password);
    console.log(user.password);

    const isPasswordValid = await bcrypt.compare(
      password,
      user?.dataValues?.password
    );
    console.log(isPasswordValid);

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid credentials." });
    }
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    console.log(accessToken, `access`);
    console.log(refreshToken, `refresh`);

    await Token.destroy({ where: { userId: user.id } }); // Invalidate old refresh tokens

    await Token.create({
      userId: user.id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    setAuthCookies(res, accessToken, refreshToken);

    res
      .status(201)
      .json({ success: true, message: "user logged in successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });

    req.user = decoded; // decoded should include user ID
    next();
  });
};
