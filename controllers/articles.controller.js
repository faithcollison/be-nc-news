const {selectArticles, selectArticleById, selectArticleComment, checkArticleExists} = require("../models/articles.model")

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
    .catch(next)
}

exports.getArticleComment = (req, res, next) => {
    const {article_id} = req.params

    const articlePromises = [selectArticleComment(article_id)]
    if(article_id){
        articlePromises.push(checkArticleExists(article_id))
    }
    Promise.all(articlePromises)
    .then((resolvedPromises) => {
        const articleComments = resolvedPromises[0]
        res.status(200).send({articleComments})
    })
    .catch(next)
}
