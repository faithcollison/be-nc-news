const app = require('../app');
const request = require('supertest');
const db = require('../db/connection.js');
const seed = require('../db/seeds/seed.js');
const {articleData, commentData, topicData, userData} = require("../db/data/test-data/index.js")


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