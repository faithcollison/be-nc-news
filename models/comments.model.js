const db = require("../db/connection.js");

exports.addComment = (article_id, newComment) => {
  const { body, username } = newComment;
  return db
    .query(
      `INSERT INTO comments(body, article_id, author) VALUES($1, $2, $3) RETURNING *;`,
      [body, article_id, username]
    )
    .then((result) => {
      return result.rows[0];
    });
};

exports.selectArticleComment = (article_id) => {
  return db
    .query(
      `SELECT comments.comment_id, comments.votes, comments.created_at, comments.author, comments.body, comments.article_id from comments JOIN articles ON comments.article_id = articles.article_id WHERE articles.article_id = $1 ORDER BY comments.created_at DESC;`,
      [article_id]
    )
    .then((result) => {
      return result.rows;
    });
};

exports.deleteCommentById = (comment_id) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *;`, [
      comment_id,
    ])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Comment does not exist",
        });
      }
    });
};

exports.changeComment = (comment_id, inc_votes) => {
  return db
    .query(
      `UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *;`,
      [inc_votes, comment_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Comment not found",
        });
      }
      return result.rows[0];
    });
};
