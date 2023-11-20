const express = require('express');
const app = express();
const {getTopics, getArticle} = require("./controllers/topics.controller")
const { handleCustomErrors, handlePsqlErrors, handleServerErrors } = require('./errors');

app.get("/api/topics", getTopics)
app.get("/api/articles/:article_id", getArticle)

app.use(handleCustomErrors)
app.use(handlePsqlErrors)
app.use(handleServerErrors)

module.exports = app