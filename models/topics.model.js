const db = require("../db/connection.js")
const endpointsObj = require("../endpoints.json")

exports.selectAllTopics = () => {
    return db.query(`SELECT * FROM topics;`)
    .then((result) => {
        return result.rows;
    })
}

exports.selectEndpoints = () => {
    return endpointsObj
}

