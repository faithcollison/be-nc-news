const app = require('../app');
const request = require('supertest');
const db = require('../db/connection.js');
const seed = require('../db/seeds/seed.js');
const {articleData, commentData, topicData, userData} = require("../db/data/test-data/index.js")
const endpointsObj = require("../endpoints.json")


beforeEach(() => seed({ articleData, commentData, topicData, userData}));
afterAll(() => db.end());

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
            expect(response.body.article.comment_count).toBe('11')
        });
    })
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
            expect(response.body.msg).toBe('not found');
        });
    });
    test('GET:400 sends an appropriate status and error message when given an invalid id', () => {
        return request(app)
        .get("/api/articles/banana/comments")
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Bad request');
        });
    })
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
});

describe('PATCH /api/articles/:article_id', () => {
    test('PATCH:200 updates article votes by positive number', () => {
        const voteChange = {inc_votes: 40}
        return request(app)
        .patch("/api/articles/1")
        .send(voteChange)
        .expect(200)
        .then((response) => {
            expect(response.body.article.votes).toBe(140)
        })
    });
    test('PATCH:200 updates article votes by negative number', () => {
        const voteChange = {inc_votes: -50}
        return request(app)
        .patch("/api/articles/1")
        .send(voteChange)
        .expect(200)
        .then((response) => {
            expect(response.body.article.votes).toBe(50)
        })
    });
    test('PATCH:404 sends an appropriate status and error message when given a valid but non-existent id', () => {
        const voteChange = {inc_votes: 50}
        return request(app)
        .patch("/api/articles/30")
        .send(voteChange)
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe('Article not found');
        });
    });
    test('PATCH:400 sends an appropriate status and error message when given an invalid id', () => {
        const voteChange = {inc_votes: 50}
        return request(app)
        .patch("/api/articles/banana")
        .send(voteChange)
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Bad request');
        });
    });
    
    test('PATCH:400 sends an appropriate status and error message when given an invalid vote change', () => {
        const voteChange = {inc_votes: "banana"}
        return request(app)
        .patch("/api/articles/1")
        .send(voteChange)
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Bad request');
        });
    });
})

describe('DELETE /api/comments/:comment_id', () => {
    test('DELETE: 204 deletes comment by comment_id and sends no body back', () => {
        return request(app)
        .delete('/api/comments/1')
        .expect(204)
    });
    test('DELETE:404 sends an appropriate status and error message when given a valid but non-existent id ', () => {
        return request(app)
        .delete('/api/comments/100')
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe('Comment does not exist')
        })
    });
    test('DELETE:400 sends an appropriate status and error message when given an invalid id', () => {
        return request(app)
        .delete('/api/comments/banana')
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Bad request')
        })
    });
});

describe('GET /api/articles (topic query)', () => {
    test('GET: 200 filters articles by topic specified in query', () => {
        return request(app)
        .get('/api/articles?topic=cats')
        .expect(200)
        .then((response) => {
            expect(response.body.articles.length).toBe(1)
            response.body.articles.forEach((article) => {
                expect(article).toMatchObject({
                    author: expect.any(String),
                    title: expect.any(String),
                    article_id: expect.any(Number),
                    topic: 'cats',
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    article_img_url: expect.any(String),
                    comment_count: expect.any(String)
                })
                expect(article).not.toMatchObject({
                    body: expect.any(String)
                });
            })
        })
    })
    test('GET: 200 responds with an empty array if topic exists but has no associated articles', () => {
        return request(app)
        .get('/api/articles?topic=paper')
        .expect(200)
        .then((response) => {
            expect(response.body.articles).toEqual([])
        })
    });
    test('GET:404 sends an appropriate status and error message when given a topic that doesn"t exist ', () => {
        return request(app)
        .get('/api/articles?topic=dogs')
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe('not found')
        })
    }); 
});

describe('GET /api/articles (sorting queries)', () => {
    test('GET: 200 sorts articles by any valid column set by user, by default descending order', () => {
        return request(app)
        .get('/api/articles?sort_by=author')
        .expect(200)
        .then((response) => {
            expect(response.body.articles.length).toBe(13);
            expect(response.body.articles).toBeSortedBy('author', {descending:true});
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
            })
        })   
    })
    test('GET: 200 sorts articles by any valid column set by user, by order determined by user', () => {
        return request(app)
        .get('/api/articles?sort_by=title&order=asc')
        .expect(200)
        .then((response) => {
            expect(response.body.articles.length).toBe(13);
            expect(response.body.articles).toBeSortedBy('title', {ascending:true});
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
            })
        })   
    })
    test('GET:400 sends an appropriate status and error message when given a sort_by column value that is invalid ', () => {
        return request(app)
        .get('/api/articles?sort_by=banana')
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Bad request')
        })
    }); 
    test('GET:400 sends an appropriate status and error message when given a order query value that is invalid', () => {
        return request(app)
        .get('/api/articles?sort_by=author&order=99')
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Bad request')
        })
    }); 
})

describe('GET /api/users', () => {
    test('GET:200 sends array of user objects back to client', () => {
        return request(app)
        .get('/api/users')
        .expect(200)
        .then((response) => {
            expect(response.body.users.length).toBe(4)
            response.body.users.forEach((user) => {
                expect(user).toMatchObject({
                    username: expect.any(String),
                    name: expect.any(String),
                    avatar_url: expect.any(String)
                })
            })
        })
    })
})

describe('GET /api/users/:username', () => {
    test('GET 200: sends single user to client determined by username', () => {
        return request(app)
        .get("/api/users/butter_bridge")
        .expect(200)
        .then((response) => {
            expect(response.body.user).toMatchObject({
                username: 'butter_bridge',
                name: 'jonny',
                avatar_url:
                'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg'
            })
        })
    });
    test('GET:404 sends an appropriate status and error message when given a non-existent username', () => {
        return request(app)
        .get("/api/users/hocus_pocus")
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe('User does not exist');
        });
    });
});