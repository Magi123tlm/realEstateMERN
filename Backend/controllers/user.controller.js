const postModel = require("../models/post.model.js");
const userModel = require("../models/user.model.js");
const savedPostModel = require("../models/savedPost.model.js");
const bcrypt = require("bcrypt");

const getUsers = async (req, res) => {
  const users = await userModel.find();
  res.status(200).json(users);

  try {
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get Users" });
  }
};

const getUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await userModel.findById(id);
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get Users" });
  }
};

const updateUser = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;

  const { password, avatar, ...inputs } = req.body;

  if (id !== tokenUserId) {
    return res.status(403).json({ message: "Not the Authorized User" });
  }

  let updatedPassword = null;

  try {
    if (password) {
      updatedPassword = await bcrypt.hash(password, 10);
    }
    const updateUser = await userModel.findByIdAndUpdate(
      id,
      {
        ...inputs,
        ...(updatedPassword && { password: updatedPassword }),
        ...(avatar && { avatar: avatar }),
      },
      {
        new: true,
      }
    );
    console.log(updateUser.toObject()); //toObject returns javascriptObject
    /* I had to use toObject because using rest without it was just giving me entire data on mongoose document when i only needed the object*/
    const { password: secretPassword, ...rest } = updateUser.toObject();
    console.log(rest);
    res.status(200).json(rest);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to update Users" });
  }
};
const deleteUser = async (req, res) => {
  const id = req.params.id;
  // const cookie = req.cookies;//do not use this because tokenUserId is coming from a secure channel (middleware)
  const tokenUserId = req.userId;

  if (id !== tokenUserId) {
    return res.status(403).json("Not the authorized user");
  }

  try {
    await userModel.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to delete User" });
  }
};

const savePost = async (req, res) => {
  const postId = req.body.postId;
  const tokenUserId = req.userId;

  try {
    const savedPost = await savedPostModel.findOne({
      userId: tokenUserId,
      postId,
    });
    if (savedPost) {
      await savedPostModel.findByIdAndDelete(savedPost._id);
      res.status(200).json({ message: "Post Removed from saved list" });
    } else {
      const newSavedPost = new savedPostModel({
        userId: tokenUserId,
        postId,
      });
      await newSavedPost.save();
      res.status(200).json({ message: "Post saved" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const profilePosts = async (req, res) => {
  const tokenUserId = req.userId;
  console.log("tokenparams", tokenUserId);
  try {
    const userPosts = await postModel.find({
      userId: tokenUserId,
    });
    const savedPosts = await savedPostModel
      .find({
        userId: tokenUserId,
      })
      .populate("postId");

    const finalPosts = savedPosts.map((item) => item.postId);
    console.log("userPosts", userPosts);
    console.log("savedPosts", savedPosts);
    console.log("finalPosts", finalPosts);
    res.status(200).json({ userPosts, finalPosts });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get Profile Posts" });
  }
};

module.exports = {
  getUsers,
  deleteUser,
  updateUser,
  savePost,
  profilePosts,
  getUser,
};
