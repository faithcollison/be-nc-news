const { sort } = require("../db/data/test-data/articles");
const { checkExists } = require("../db/seeds/utils");
const {selectArticles, selectArticleById, updateArticleVotes} = require("../models/articles.model")

exports.getArticles = (req, res, next) => {
    const topicQuery = req.query.topic
    const sort_by = req.query.sort_by
    const order = req.query.order

    const articlePromises = [selectArticles(topicQuery, sort_by, order)];

    if(topicQuery){
        articlePromises.push(checkExists("topics", "slug", topicQuery))
    }

    Promise.all(articlePromises)
    .then((resolvedPromises) => {
        const articles = resolvedPromises[0]
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

exports.updateArticle = (req, res, next) => {
    const{article_id} = req.params
    const updateVotes = req.body
    updateArticleVotes(article_id, updateVotes)
    .then((article) => {
        res.status(200).send({article})
    })
    .catch(next)
}
