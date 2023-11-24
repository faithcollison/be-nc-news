const topicsRouter = require("express").Router();
const {getTopics, createTopic} =require("../controllers/topics.controller")

topicsRouter
.route("/")
.get(getTopics)
.post(createTopic)

module.exports = topicsRouter