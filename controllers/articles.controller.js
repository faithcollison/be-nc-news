const {selectArticles, selectArticleById, addComment} = require("../models/articles.model")

exports.getArticles = (req, res, next) => {
    selectArticles()
    .then((articles) => {
        res.status(200).send({articles})
    })
    .catch(next);
}
exports.getArticle = (req, res, next) => {
    const {article_id} = req.params
    selectArticleById(article_id)
    .then((article) => {
        res.status(200).send({article})
    })
    .catch(next);
}

exports.postComment = (req, res, next) => {
    const {article_id} = req.params
    const newComment = req.body
    addComment(article_id, newComment)
    .then((comment) => {
        res.status(201).send({comment})
    })
    .catch(next)
}