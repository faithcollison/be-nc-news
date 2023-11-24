const db = require("../db/connection.js")

exports.selectAllTopics = () => {
    return db.query(`SELECT * FROM topics;`)
    .then((result) => {
        return result.rows;
    })
}

exports.newTopic = (newTopic) => {
    const {slug, description} = newTopic
    return db.query(`INSERT INTO topics(slug, description) VALUES($1, $2) RETURNING *;`,[slug, description])
    .then((result) => {
        return result.rows[0]
    })
}