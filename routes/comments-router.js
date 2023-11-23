const commentsRouter = require("express").Router();
const { updateArticle } = require("../controllers/articles.controller");
const {deleteComment, updateComment} = require("../controllers/comments.controller")

commentsRouter
.route("/:comment_id")
.delete(deleteComment)
.patch(updateComment)


module.exports = commentsRouter