const {selectArticles, selectArticleById, selectArticleComment, updateArticleVotes, addComment, deleteCommentById} = require("../models/articles.model")

exports.getArticles = (req, res, next) => {
    const topicQuery = req.query.topic
    selectArticles(topicQuery)
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
    .catch(next)
}

exports.getArticleComment = (req, res, next) => {
    const {article_id} = req.params
    
    const articlePromises = [selectArticleComment(article_id), selectArticleById(article_id)]

    Promise.all(articlePromises)
    .then((resolvedPromises) => {
        const articleComments = resolvedPromises[0]
        res.status(200).send({comments: articleComments})
    })
    .catch(next)
}

exports.updateArticle = (req, res, next) => {
    const{article_id} = req.params
    const updateVotes = req.body
    updateArticleVotes(article_id, updateVotes)
    .then((article) => {
        res.status(200).send({article})
    })
    .catch(next)
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

exports.deleteComment = (req, res, next) => {
    const{comment_id} = req.params
    deleteCommentById(comment_id)
    .then(() => {
        res.status(204).send()
    })
    .catch(next)
}