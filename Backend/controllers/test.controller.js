const jwt = require("jsonwebtoken");

const shouldBeLoggedIn = async (req, res) => {
  console.log(req.userId);
  res.status(200).json({ message: "You are authenticated" });
};

const shouldBeAdmin = async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res
      .status(401)
      .json({ message: "Not Authenticated and cookie not found" });
  }
  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
    if (err) {
      return res.status(403).json({ message: "Token is not valid" });
    }
    console.log("jwt", jwt);
    console.log("payload", payload);
    if (!payload.isAdmin) {
      return res
        .status(403)
        .json({ message: "Not authorized for admin access" });
    }
  });
  res.status(200).json({ message: "You are authenticated" });
};

module.exports = { shouldBeAdmin, shouldBeLoggedIn };
