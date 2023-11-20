const app = require('../app');
const request = require('supertest');
const db = require('../db/connection.js');
const seed = require('../db/seeds/seed.js');
const {articleData, commentData, topicData, userData} = require("../db/data/test-data/index.js")
const endpointsObj = require("../endpoints.json")


beforeEach(() => seed({ articleData, commentData, topicData, userData}));
afterAll(() => db.end());

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
    test('GET : 404 path not found', () => {
        return request(app)
        .get("/api/notARoute")
        .expect(404)
        .then((response) => {
            expect(response.res.statusMessage).toBe('Not Found');
        })
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
    test('GET : 404 path not found', () => {
        return request(app)
        .get("/api/notARoute")
        .expect(404)
        .then((response) => {
            expect(response.res.statusMessage).toBe('Not Found');
        })
    });
});