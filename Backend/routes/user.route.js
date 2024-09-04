const express = require("express");
const router = express.Router();
const {
  getUsers,
  getUser,
  deleteUser,
  updateUser,
  savePost,
  profilePosts,
} = require("../controllers/user.controller.js");
const { verifyToken } = require("../middleware/verifyToken.js");

router.get("/", getUsers);
// router.get("/:id", verifyToken, getUser);
router.put("/:id", verifyToken, updateUser);
router.delete("/:id", verifyToken, deleteUser);
router.post("/save", verifyToken, savePost);
router.get("/profilePosts", verifyToken, profilePosts);

module.exports = router;
