const apiRouter = require('express').Router();

const userRouter = require('./users-router');
const commentsRouter = require('./comments-router');
const articlesRouter = require('./articles-router');
const topicsRouter = require('./topics-router');

const {getEndpoints} =require("../controllers/api.controller")

apiRouter.get('/', getEndpoints)

apiRouter.use('/users', userRouter);
apiRouter.use('/comments', commentsRouter);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/topics', topicsRouter);

module.exports = apiRouter;