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

describe("POST /api/articles/:article_id/comments", () => {
    test('POST: 200 adds new comment for given article', () => {
        const newComment = {
            body: "10/10 enjoyed, will be reading this again.",
            username: "butter_bridge"
        };
        return request(app)
        .post("/api/articles/2/comments")
        .send(newComment)
        .expect(201)
        .then(({body}) => {
            expect(body.comment.comment_id).toBe(19);
            expect(body.comment.body).toBe("10/10 enjoyed, will be reading this again.");
            expect(body.comment.votes).toBe(0);
            expect(body.comment.author).toBe("butter_bridge");
            expect(body.comment.article_id).toBe(2);
            expect(typeof body.comment.created_at).toBe("string");
        }) 
    });
    test('POST: 400 sends an appropriate status and error message when given a non-existent article_id', () => {
        const newComment = {
            body: "10/10 enjoyed, will be reading this again.",
            username: "butter_bridge"
        };
        return request(app)
        .post("/api/articles/20/comments")
        .send(newComment)
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Bad request');
        });
    });
    test('POST:400 responds with an appropriate status and error message when provided with a bad comment (no username given)', () => {
        const newComment = {
            body: "10/10 enjoyed, will be reading this again."
        };
        return request(app)
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Bad request');
        });
    });
})