const db = require("../db/connection.js")

exports.selectArticles = (topicQuery, sort_by, order) => {
    const queryValues = []
    const validSortBy = ["article_id", "title", "topic", "author", "body", "created_by", "votes"]
    const validOrder = ['asc', 'desc']
    
    if (sort_by && ! validSortBy.includes(sort_by)) {
        return Promise.reject({ status: 400, msg: 'Bad request' });
    }
    else if (order && !validOrder.includes(order)) {
        return Promise.reject({ status: 400, msg: 'Bad request' });
    }
    
    let queryStr = `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id `

    if(topicQuery){
        queryValues.push(topicQuery)
        queryStr += `WHERE articles.topic = $1 GROUP BY articles.article_id ORDER BY created_at DESC;`
    }
    else if(sort_by && !order){
        queryStr += `GROUP BY articles.article_id ORDER BY articles.${sort_by} DESC`
    }
    else if(sort_by && order){
        queryStr += `GROUP BY articles.article_id ORDER BY articles.${sort_by} ${order}`
    }
    else {
        queryStr += `GROUP BY articles.article_id ORDER BY created_at DESC;`
    }    
    
    return db.query(queryStr, queryValues)
        .then((result) => {
            return result.rows
        })
}

exports.selectArticleById = (article_id) => {
    return db.query(`SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.body, articles.article_img_url, COUNT(comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;`, [article_id])
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

exports.createArticle = (newArticle) => {
    const{title, topic, author, body, article_img_url} = newArticle
    return db.query(`WITH inserted_article AS (INSERT INTO articles(title, topic, author, body, article_img_url) VALUES($1, $2, $3, $4, $5) RETURNING *)
    SELECT inserted_article.article_id, inserted_article.title, inserted_article.topic, inserted_article.author, inserted_article.created_at, inserted_article.votes, inserted_article.body, inserted_article.article_img_url, COUNT(comments.comment_id) AS comment_count FROM inserted_article LEFT JOIN comments ON inserted_article.article_id = comments.article_id GROUP BY inserted_article.article_id, inserted_article.title, inserted_article.topic, inserted_article.author, inserted_article.created_at, inserted_article.votes, inserted_article.body, inserted_article.article_img_url;`, [title, topic, author, body, article_img_url]) 
    .then((result) => {
        return result.rows[0]
    })
}
// db.query(`SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.body, articles.article_img_url, COUNT(comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id;`)
// `INSERT INTO articles(title, topic, author, body, article_img_url) VALUES($1, $2, $3, $4, $5) RETURNING *;`,[title, topic, author, body, article_img_url]