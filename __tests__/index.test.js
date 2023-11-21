const app = require('../app');
const request = require('supertest');
const db = require('../db/connection.js');
const seed = require('../db/seeds/seed.js');
const {articleData, commentData, topicData, userData} = require("../db/data/test-data/index.js")
const endpointsObj = require("../endpoints.json")


beforeEach(() => seed({ articleData, commentData, topicData, userData}));
afterAll(() => db.end());

describe('ERR: no endpoint reached', () => {
    test('GET : 404 path not found', () => {
        return request(app)
        .get("/api/notARoute")
        .expect(404)
        .then((response) => {
            expect(response.res.statusMessage).toBe('Not Found');
        })
    });
});

describe('GET /api/topics', () => {
    test('GET : 200 sends an array of topic objects to client', () => {
        return request(app)
        .get("/api/topics")
        .expect(200)
        .then((response) => {
            expect(response.body.topics.length).toBe(3);
            response.body.topics.forEach((topic) => {
                expect(topic).toMatchObject({
                    description: expect.any(String),
                    slug: expect.any(String)
                })
            })
        })
    });
});
describe('GET /api/articles/:article_id', () => {
    test('GET : 200 sends a single article to client', () => {
        return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then((response) => {
            expect(response.body.article.article_id).toBe(1);
            expect(response.body.article.title).toBe("Living in the shadow of a great man");
            expect(response.body.article.topic).toBe("mitch");
            expect(response.body.article.author).toBe("butter_bridge");
            expect(response.body.article.body).toBe("I find this existence challenging");
            expect(response.body.article.votes).toBe(100);
            expect(typeof response.body.article.created_at).toBe('string');
            expect(response.body.article.article_img_url).toBe("https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700");
        })
    });
    test('GET:404 sends an appropriate status and error message when given a valid but non-existent id', () => {
        return request(app)
        .get("/api/articles/20")
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe('Article does not exist');
        });
    });
    test('GET:400 sends an appropriate status and error message when given an invalid id', () => {
        return request(app)
        .get("/api/articles/banana")
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Bad request');
        });
    });
});

describe('GET /api', () => {
    test('GET: 200 sends object containing all available endpoints to client', () => {
        return request(app)
        .get("/api")
        .expect(200)
        .then((response) => {
            expect(response.body).toMatchObject(endpointsObj)
        })
    });
});

describe('GET /api/articles', () => {
    test('GET: 200 sends array of all articles to client', () => {
        return request(app)
        .get("/api/articles")
        .expect(200)
        .then((response) => {
            expect(response.body.articles.length).toBe(13);
            response.body.articles.forEach((article) => {
                expect(article).toMatchObject({
                    author: expect.any(String),
                    title: expect.any(String),
                    article_id: expect.any(Number),
                    topic: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    article_img_url: expect.any(String),
                    comment_count: expect.any(String)
                })
                expect(article).not.toMatchObject({
                    body: expect.any(String)
                })
            })
            expect(response.body.articles).toBeSortedBy('created_at', {descending:true})
        })
    });
});

describe('GET /api/articles/:article_id/comments', () => {
    test('GET: 200 sends array of comments for given article_id to the client', () => {
        return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then((response) => {
            // console.log(response.body)
            expect(response.body.comments.length).toBe(11);
            response.body.comments.forEach((comment)=> {
                expect(comment).toMatchObject({
                    comment_id: expect.any(Number),
                    votes: expect.any(Number),
                    created_at: expect.any(String),
                    author: expect.any(String),
                    body: expect.any(String),
                    article_id: expect.any(Number)
                })
            })
            expect(response.body.comments).toBeSortedBy("created_at", {descending:true})
        })
    });
    test('GET: 200 responds with an empty array if article_id exists but there are no comments with that id', () => {
        return request(app)
        .get("/api/articles/2/comments")
        .expect(200)
        .then((response) => {
            expect(response.body.comments).toEqual([])
        })
    });
    test('GET:404 sends an appropriate status and error message when given a valid but non-existent id', () => {
        return request(app)
        .get("/api/articles/30/comments")
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe('Article does not exist');
        });
    });
    test('GET:400 sends an appropriate status and error message when given an invalid id', () => {
        return request(app)
        .get("/api/articles/banana/comments")
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Bad request');
        });
    });
});
