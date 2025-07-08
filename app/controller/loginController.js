const ADMIN_EMAIL = "admin@example.com";
const ADMIN_PASSWORD = "admin123";

exports.login = (req, res) => {
  const { email, password } = req.body;
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    res.json({ success: true, message: "Login successful" });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
};
