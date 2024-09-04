const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  // console.log("token", token);
  if (!token)
    return res.status(401).json({ message: "Not Authenticated womp womp" });

  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
    if (err) return res.status(403).json({ message: "Token is not valid" });
    req.userId = payload._id;
    next();
  });
};

//Function in test.controller.js "should be logged in wala"
// const token = req.cookies.token;
//   if (!token) {
//     return res
//       .status(401)
//       .json({ message: "Not Authenticated and cookie not found" });
//   }
//   console.log(jwt);
//   jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
//     if (err) {
//       return res.status(403).json({ message: "Token is not valid" });
//     }
//   });

module.exports = { verifyToken };
