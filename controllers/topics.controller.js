const {selectAllTopics, selectEndpoints} = require("../models/topics.models")

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
