const db = require("../db/connection.js")
const endpointsObj = require("../endpoints.json")

exports.selectAllTopics = () => {
    return db.query(`SELECT * FROM topics;`)
    .then((result) => {
        return result.rows;
    })
}

exports.selectEndpoints = () => {
    return endpointsObj
}

exports.selectArticles = () => {
    return db.query(`SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY created_at DESC;`)
    .then((result) => {
        return result.rows
    })
}