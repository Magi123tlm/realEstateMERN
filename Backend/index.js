const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const cors = require("cors");
const postRoute = require("./routes/post.route.js");
const authRoute = require("./routes/auth.route.js");
const testRoute = require("./routes/test.route.js");
const userRoute = require("./routes/user.route.js");
const app = express();
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/posts/", postRoute);
app.use("/api/auth/", authRoute);
app.use("/api/test/", testRoute);
app.use("/api/users/", userRoute);

mongoose
  .connect(process.env.DB_URI)
  .then(() => {
    console.log("connected successfully");
    app.listen(process.env.PORT, (err) => {
      if (err) console.log("DataBase Mongoose error (index.js):", err);
      console.log("server is started at port: 3210");
    });
  })
  .catch((err) => {
    console.log(err.message);
  });

// app.get("/", (req, res) => {
//   res.send("<h1 style ='color:blue; text-align:center;' >hello boy</h1>");
// });
