const postDetailModel = require("../models/postDetail.model.js");
const postModel = require("../models/post.model.js");
const savedPostModel = require("../models/savedPost.model.js");
const jwt = require("jsonwebtoken");

const getPosts = async (req, res) => {
  const query = req.query;
  let queryObj = {};
  console.log("query", query);
  // Destructure and parse the query parameters
  const { city, type, property, bedroom, minPrice, maxPrice } = query;

  // Conditionally add parameters to queryObj if they are defined
  if (city) queryObj.city = city;
  if (type) queryObj.type = type;
  if (property) queryObj.property = property;
  if (bedroom) queryObj.bedroom = bedroom;

  // Handle price range
  if (minPrice) {
    queryObj.price = queryObj.price || {};
    queryObj.price.$gte = parseInt(minPrice);
  }
  if (maxPrice) {
    queryObj.price = queryObj.price || {};
    queryObj.price.$lte = parseInt(maxPrice);
  }
  const { type: newType, ...rest } = queryObj;
  console.log(rest);
  if (
    city === "undefined" ||
    property === "undefined" ||
    bedroom === "undefined" ||
    queryObj.price.$gte === 0 ||
    queryObj.price.$lte === 0
  ) {
    queryObj = {};
  }
  console.log("queryObj: ", queryObj);

  try {
    const posts = await postModel.find(queryObj);
    console.log("posts", posts);
    // setTimeout(() => {
    res.status(200).json(posts);
    // }, 3000);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get Posts" });
  }
};
const getPost = async (req, res) => {
  const id = req.params.id;

  try {
    const post = await postModel
      .findById(id)
      .populate({
        path: "postDetail",
      })
      .populate({
        path: "userId",
        select: "username avatar",
      });

    const postObject = post.toObject();

    const token = req.cookies?.token;
    console.log("tojen", token);
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
        console.log(payload._id, id);
        if (!err) {
          const saved = await savedPostModel.findOne({
            postId: id,
            userId: payload._id,
          });

          res
            .status(200)
            .json({ ...postObject, isSaved: saved ? true : false });
        }
      });
    } else {
      res.status(200).json({ ...postObject, isSaved: false });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get Post" });
  }
};
const addPost = async (req, res) => {
  const body = req.body;
  const tokenId = req.userId;

  try {
    const newPost = new postModel({
      ...body.postData,
      userId: tokenId,
    });
    const savePost = await newPost.save();

    const newPostDetail = new postDetailModel({
      ...body.postDetail,
      postId: savePost._id,
    });
    const savedPostDetail = await newPostDetail.save();
    savePost.postDetail = savedPostDetail._id;

    const updatedPost = await savePost.save();
    console.log("savePost", savePost, "savePostDetail", savedPostDetail);

    res.status(200).json(updatedPost);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to create Post" });
  }
};
const updatePost = async (req, res) => {
  try {
    res.status(200).json();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to update Post" });
  }
};
const deletePost = async (req, res) => {
  const id = req.params.id;
  const tokenId = req.userId;
  try {
    const post = await postModel.findById(id);
    if (post.userId.toHexString() !== tokenId) {
      return res.status(403).json({ message: "NOt authorized to delete post" });
    }
    await postModel.findByIdAndDelete(id);
    res.status(200).json({ message: "post deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to delete Post" });
  }
};

module.exports = { getPosts, getPost, addPost, updatePost, deletePost };
