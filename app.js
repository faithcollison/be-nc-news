const express = require('express');
const app = express();
const {getTopics, getEndpoints} = require("./controllers/topics.controller")
const { handleCustomErrors, handlePsqlErrors, handleServerErrors } = require('./errors');

app.get("/api/topics", getTopics)
app.get("/api", getEndpoints)

app.use(handleCustomErrors)
app.use(handlePsqlErrors)
app.use(handleServerErrors)

module.exports = app