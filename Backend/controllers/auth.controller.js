const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model.js");

const register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    //Hash The Password
    const hashedPassword = await bcrypt.hash(password, 10);

    //Create A New User and Save to DB
    const newUser = new userModel({
      username: username,
      email: email,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();
    res.status(201).json({ message: "User Created" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to create user" });
  }
};
const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    //CHECK IF USER EXISTS OR NOT
    const isUser = await userModel.findOne({ username: username });
    if (!isUser) {
      return res.status(401).json({
        message:
          "User does not exist! or Invalid Credentials(kyuki we should not tell anyone about user existing or not in out database)",
      });
    }
    // console.log(isUser);
    //CHECK IF PASSWORD IS CORRECT
    const isPasswordValid = await bcrypt.compare(password, isUser.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message:
          "Invalid Password or keep it secret and say invalid credentials",
      });
    }
    //JWT TOken
    const token = jwt.sign(
      {
        //payload
        _id: isUser._id,
        isAdmin: false,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "60m" }
    );

    const {
      _doc: { password: userPassword, ...userInfo },
      ...everythingElse
    } = isUser;
    const updatedUser = { _doc: { ...userInfo }, ...everythingElse };
    //GENERATE COOKIE TOKEN AND SEND IT TO USER
    //Without Cookie-Parser
    // res.setHeader("Set-Cookie", "test=" + "myValue").json({ message: "success" });
    //With Cookie-Parser
    const age = 1000 * 60 * 60;
    res.cookie("token", token, {
      httpOnly: true,
      // secure: true,
      maxAge: age,
    });
    res.status(200).json({
      message:
        "Login Successfull and not shared password to browser for secruity as well",
      updatedUser: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: "LOGIN Failed!" });
  }
};
const logout = (req, res) => {
  res
    .clearCookie("token")
    .status(200)
    .json({ message: "Logout Successfull and cookies cleared" });
};

module.exports = { register, login, logout };
