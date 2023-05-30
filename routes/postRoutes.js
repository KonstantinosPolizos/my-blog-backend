const express = require("express");
const validateToken = require("../middlewares/tokenValidation");

const router = express.Router();

const {
  getAllPosts,
  getOnePost,
  postOnePost,
  updateOnePost,
  deleteOnePost,
} = require("../controllers/postControllers");

router.route("/").get(validateToken, getAllPosts);
router.route("/:id").get(validateToken, getOnePost);
router.route("/").post(validateToken, postOnePost);
router.route("/:id").put(validateToken, updateOnePost);
router.route("/:id").delete(validateToken, deleteOnePost);

module.exports = router;
