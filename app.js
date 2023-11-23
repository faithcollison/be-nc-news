// const {getTopics, getEndpoints} = require("./controllers/topics.controller")
// const {getArticles, getArticle, updateArticle } = require("./controllers/articles.controller")
// const { getUsers } = require('./controllers/users.controller');
// const {getArticleComment, postComment, deleteComment} = require("./controllers/comments.controller")
const express = require('express');
const app = express();
const { handleCustomErrors, handlePsqlErrors, handleServerErrors } = require('./errors');
const apiRouter = require("./routes/api-router.js")

app.use(express.json());
app.use('/api', apiRouter);

app.use(handleCustomErrors)
app.use(handlePsqlErrors)
app.use(handleServerErrors)

module.exports = app

// app.get("/api/topics", getTopics)
// app.get("/api/articles/:article_id", getArticle)
// app.get("/api", getEndpoints)
// app.get("/api/articles", getArticles)
// app.get("/api/articles/:article_id/comments", getArticleComment)
// app.get("/api/users", getUsers)

// app.patch("/api/articles/:article_id", updateArticle)

// app.post("/api/articles/:article_id/comments", postComment)

// app.delete("/api/comments/:comment_id", deleteComment)
