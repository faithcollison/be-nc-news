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
exports.selectArticleById = (article_id) => {
    return db.query(`SELECT * from articles WHERE article_id = $1`, [article_id])
    .then((result) => {
        if(result.rows.length === 0){
            return Promise.reject({
                status: 404,
                msg: 'Article does not exist' 
            })
        }
        return result.rows[0];
    })
}
