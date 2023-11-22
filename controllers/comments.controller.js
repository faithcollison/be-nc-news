const { checkExists } = require("../db/seeds/utils");
const {selectArticleComment, addComment, deleteCommentById} = require("../models/comments.model")

exports.getArticleComment = (req, res, next) => {
    const {article_id} = req.params
    const articlePromises = [selectArticleComment(article_id)];
    
    if(article_id){
        articlePromises.push(checkExists("articles", "article_id", article_id))
    }
    
    Promise.all(articlePromises)
    .then((resolvedPromises) => {
        const articleComments = resolvedPromises[0]
        res.status(200).send({comments: articleComments})
    })
    .catch(next)
}

exports.postComment = (req, res, next) => {
    const {article_id} = req.params
    const newComment = req.body
    addComment(article_id, newComment)
    .then((comment) => {
        res.status(201).send({comment})
    })
    .catch(next)
}

exports.deleteComment = (req, res, next) => {
    const{comment_id} = req.params
    deleteCommentById(comment_id)
    .then(() => {
        res.status(204).send()
    })
    .catch(next)
}