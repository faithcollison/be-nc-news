const {selectAllTopics, selectEndpoints} = require("../models/topics.model")


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

