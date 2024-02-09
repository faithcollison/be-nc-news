const { selectAllTopics, newTopic } = require("../models/topics.model");

exports.getTopics = (req, res, next) => {
  selectAllTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.createTopic = (req, res, next) => {
  const topic = req.body;

  newTopic(topic)
    .then((topic) => {
      res.status(201).send({ topic });
    })
    .catch(next);
};
