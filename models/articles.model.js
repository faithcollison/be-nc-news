const db = require("../db/connection.js")

exports.selectArticles = () => {
    return db.query(`SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY created_at DESC;`)
    .then((result) => {
        return result.rows
    })
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

exports.addComment = (article_id, newComment) => {
    const {body, username} = newComment
    return db
    .query(`INSERT INTO comments(body, article_id, author) VALUES($1, $2, $3) RETURNING *;`,[body, article_id, username]) 
    .then((result) => {
        return result.rows[0]
    })
}

exports.updateArticleVotes = (article_id, updateVotes) => {
    const {inc_votes} = updateVotes 
    return db.query(`UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`, [inc_votes, article_id])
    .then((result) => {
        if(result.rows.length === 0){
            return Promise.reject({
                status: 404, 
                msg: 'Article not found'
            })
        }
        return result.rows[0]
    })
}

exports.selectArticleComment = (article_id) => {
    return db.query(`SELECT comments.comment_id, comments.votes, comments.created_at, comments.author, comments.body, comments.article_id from comments JOIN articles ON comments.article_id = articles.article_id WHERE articles.article_id = $1 ORDER BY comments.created_at DESC;`, [article_id])
    .then((result) => {
        return result.rows
    })
}