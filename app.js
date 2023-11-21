const express = require('express');
const app = express();
const {getTopics, getEndpoints} = require("./controllers/topics.controller")
const {getArticles,  getArticle, postComment} = require("./controllers/articles.controller")
const { handleCustomErrors, handlePsqlErrors, handleServerErrors } = require('./errors');

app.use(express.json());

app.get("/api/topics", getTopics)
app.get("/api/articles/:article_id", getArticle)

app.get("/api/topics", getTopics)
app.get("/api", getEndpoints)
app.get("/api/articles", getArticles)

app.post("/api/articles/:article_id/comments", postComment)

app.use(handleCustomErrors)
app.use(handlePsqlErrors)
app.use(handleServerErrors)

module.exports = app