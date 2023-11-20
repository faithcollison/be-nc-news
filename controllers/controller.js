const {selectAllTopics, selectEndpoints, selectArticles, selectArticleById} = require("../models/models")


exports.getTopics = (req, res, next) => {
    selectAllTopics().then((topics) => {
        res.status(200).send({topics})
    })
    .catch((err) => {
        console.log(err)
    });
}

exports.getEndpoints = (req, res, next) => {
    const endpointsData = selectEndpoints();
    res.status(200).send(endpointsData)
}

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

