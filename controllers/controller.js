const {selectAllTopics, selectEndpoints, selectArticles} = require("../models/models")

exports.getTopics = (req, res, next) => {
    selectAllTopics().then((topics) => {
        res.status(200).send({topics})
    })
    .catch(next);
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