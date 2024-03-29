const { checkExists } = require("../db/seeds/utils");
const {
  selectArticles,
  selectArticleById,
  updateArticleVotes,
  createArticle,
} = require("../models/articles.model");

exports.getArticles = (req, res, next) => {
  const topicQuery = req.query.topic;
  const sort_by = req.query.sort_by;
  const order = req.query.order;
  const limit = req.query.limit;
  const page = req.query.p;

  const articlePromises = [
    selectArticles(topicQuery, sort_by, order, limit, page),
  ];

  if (topicQuery) {
    articlePromises.push(checkExists("topics", "slug", topicQuery));
  }

  Promise.all(articlePromises)
    .then(([queryresult]) => {
      res.status(200).send({
        total_count: queryresult.totalCount[0].count,
        articles: queryresult.queryResponse,
      });
    })
    .catch(next);
};

exports.getArticle = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.updateArticle = (req, res, next) => {
  const { article_id } = req.params;
  const updateVotes = req.body;
  updateArticleVotes(article_id, updateVotes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.addArticle = (req, res, next) => {
  const newArticle = req.body;
  createArticle(newArticle)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};
