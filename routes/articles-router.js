const articlesRouter = require("express").Router();
const { getArticles, getArticle, updateArticle, addArticle} =require("../controllers/articles.controller");
const {getArticleComment,  postComment} = require('../controllers/comments.controller')

articlesRouter
.route("/")
.get(getArticles)
.post(addArticle)

articlesRouter
.route("/:article_id")
.get(getArticle)
.patch(updateArticle)

articlesRouter
.route("/:article_id/comments")
.get(getArticleComment)
.post(postComment)


module.exports = articlesRouter