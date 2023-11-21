const express = require('express');
const app = express();
const {getTopics, getEndpoints} = require("./controllers/topics.controller")
const {getArticles,  getArticle} = require("./controllers/articles.controller")
const { handleCustomErrors, handlePsqlErrors, handleServerErrors } = require('./errors');

app.get("/api/topics", getTopics)
app.get("/api/articles/:article_id", getArticle)

app.get("/api/topics", getTopics)
app.get("/api", getEndpoints)
app.get("/api/articles", getArticles)

app.use(handleCustomErrors)
app.use(handlePsqlErrors)
app.use(handleServerErrors)

module.exports = app