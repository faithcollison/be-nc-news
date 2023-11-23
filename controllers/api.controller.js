const {selectEndpoints} = require("../models/api.model")

exports.getEndpoints = (req, res, next) => {
    const endpointsData = selectEndpoints();
    res.status(200).send(endpointsData)
}
