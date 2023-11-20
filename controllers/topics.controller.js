const {selectAllTopics, selectArticleById, selectEndpoints} = require("../models/topics.models")

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

exports.getArticle = (req, res, next) => {
    const {article_id} = req.params
    selectArticleById(article_id)
    .then((article) => {
        res.status(200).send({article})
    })
    .catch(next);
}

