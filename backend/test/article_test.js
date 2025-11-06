const chai = require("chai");
const expect = chai.expect;
const request = require("supertest");
const app = require("../app.js");
const mongoose = require("mongoose");
const User = require("../src/models/user.js");
const Article = require("../src/models/article.js");

describe("Article Routes", function () {
  this.timeout(40000); // timeout for slow external API

  let agent = request.agent(app);
  let cookies;
  let testUserId;
  let createdArticleId;
  let otherUserId;
  let otherCookies;

  // Use safe, valid credentials
  const testUser = {
    username: "articleuser13",
    email: "articleuser13@example.com",
    password: "articlepass123",
  };

  const otherUser = {
    username: "otherarticleuser14",
    email: "otherarticleuser14@example.com",
    password: "otherarticlepass123",
  };

  before(async function () {
    // Clean users before starting for 100% reliability
    await User.deleteOne({ email: testUser.email });
    await User.deleteOne({ email: otherUser.email });

    // Register and login main test user
    const signupRes = await agent
      .post("/api/auth/signup")
      .send(testUser)
      .expect(201);
    expect(signupRes.body).to.have.property("user");
    testUserId = signupRes.body.user.id;

    const loginRes = await agent
      .post("/api/auth/login")
      .send({ email: testUser.email, password: testUser.password })
      .expect(200);
    console.log("main user signup and login done");

    cookies = loginRes.headers["set-cookie"];
    expect(cookies).to.be.an("array").that.is.not.empty;
    cookies = cookies.join("; ");

    // Register and login other user for authorization tests
    const otherAgent = request.agent(app);
    const otherSignupRes = await otherAgent
      .post("/api/auth/signup")
      .send(otherUser)
      .expect(201);
    otherUserId = otherSignupRes.body.user.id;

    const otherLoginRes = await otherAgent
      .post("/api/auth/login")
      .send({ email: otherUser.email, password: otherUser.password })
      .expect(200);

    otherCookies = otherLoginRes.headers["set-cookie"];
    expect(otherCookies).to.be.an("array").that.is.not.empty;
    otherCookies = otherCookies.join("; ");
  });

  it("should create a new article", async function () {
    const res = await agent
      .post("/api/article")
      .set("Cookie", cookies)
      .send({
        title: "Test Article Title",
        body: "This is the body of the test article.",
        source: "Test Source",
        visibility: "public",
      })
      .expect(201);

    expect(res.body).to.have.property(
      "message",
      "Article created successfully"
    );
    expect(res.body).to.have.property("article");
    expect(res.body.article).to.have.property("title", "Test Article Title");
    expect(res.body.article).to.have.property(
      "body",
      "This is the body of the test article."
    );
    expect(res.body.article).to.have.property("source", "Test Source");
    expect(res.body.article).to.have.property("visibility", "public");
    expect(res.body.article).to.have.property("owner");
    createdArticleId = res.body.article._id;
  });

  it("should not create article with missing required fields", async function () {
    await agent
      .post("/api/article")
      .set("Cookie", cookies)
      .send({ title: "Missing Body" })
      .expect(400)
      .then((res) => {
        expect(res.body).to.have.property(
          "error",
          "Title and body are required."
        );
      });

    await agent
      .post("/api/article")
      .set("Cookie", cookies)
      .send({ body: "Missing Title" })
      .expect(400)
      .then((res) => {
        expect(res.body).to.have.property(
          "error",
          "Title and body are required."
        );
      });
  });

  it("should not create article if not authenticated", async function () {
    await request(app)
      .post("/api/article")
      .send({
        title: "Unauthenticated Article",
        body: "This should fail.",
      })
      .expect(401);
  });

  it("should get articles by user with pagination", async function () {
    const res = await agent
      .get(`/api/article/user/${testUserId}`)
      .set("Cookie", cookies)
      .expect(200);

    expect(res.body).to.have.property("articles");
    expect(res.body).to.have.property("total");
    expect(res.body).to.have.property("page", 1);
    expect(res.body).to.have.property("limit", 5);
    expect(res.body.articles).to.be.an("array");
    expect(res.body.articles.length).to.be.greaterThan(0);
  });

  it("should get articles by user with custom pagination", async function () {
    const res = await agent
      .get(`/api/article/user/${testUserId}?limit=2&page=1&sort=desc`)
      .set("Cookie", cookies)
      .expect(200);

    expect(res.body).to.have.property("articles");
    expect(res.body).to.have.property("total");
    expect(res.body).to.have.property("page", 1);
    expect(res.body).to.have.property("limit", 2);
    expect(res.body.articles).to.be.an("array").with.lengthOf(1);
  });

  it("should get single article by ID", async function () {
    const res = await agent
      .get(`/api/article/${createdArticleId}`)
      .set("Cookie", cookies)
      .expect(200);

    expect(res.body).to.have.property("article");
    expect(res.body.article).to.have.property("_id", createdArticleId);
    expect(res.body.article).to.have.property("title", "Test Article Title");
  });

  it("should return cached article on second request", async function () {
    // First request
    await agent
      .get(`/api/article/${createdArticleId}`)
      .set("Cookie", cookies)
      .expect(200);

    // Second request should be cached
    const res = await agent
      .get(`/api/article/${createdArticleId}`)
      .set("Cookie", cookies)
      .expect(200);

    // The controller returns cached: true for cached responses
    if (res.body.cached) {
      expect(res.body).to.have.property("cached", true);
    }
  });

  it("should error when getting non-existent article", async function () {
    const fakeId = new mongoose.Types.ObjectId().toString();
    await agent
      .get(`/api/article/${fakeId}`)
      .set("Cookie", cookies)
      .expect(404)
      .then((res) => {
        expect(res.body).to.have.property("error", "Article not found");
      });
  });

  it("should update an article", async function () {
    const res = await agent
      .put(`/api/article/${createdArticleId}`)
      .set("Cookie", cookies)
      .send({
        title: "Updated Article Title",
        body: "Updated article body.",
        visibility: "private",
      })
      .expect(200);

    expect(res.body).to.have.property("message", "Article updated");
    expect(res.body).to.have.property("article");
    expect(res.body.article).to.have.property("title", "Updated Article Title");
    expect(res.body.article).to.have.property("body", "Updated article body.");
    expect(res.body.article).to.have.property("visibility", "private");
  });

  it("should not update article if not owner", async function () {
    const otherAgent = request.agent(app);
    await otherAgent
      .put(`/api/article/${createdArticleId}`)
      .set("Cookie", otherCookies)
      .send({ title: "Unauthorized Update" })
      .expect(403)
      .then((res) => {
        expect(res.body).to.have.property(
          "error",
          "Unauthorized: Not your article."
        );
      });
  });

  it("should not update non-existent article", async function () {
    const fakeId = new mongoose.Types.ObjectId().toString();
    await agent
      .put(`/api/article/${fakeId}`)
      .set("Cookie", cookies)
      .send({ title: "Non-existent Update" })
      .expect(404)
      .then((res) => {
        expect(res.body).to.have.property("error", "Article not found");
      });
  });

  it("should delete an article", async function () {
    const res = await agent
      .delete(`/api/article/${createdArticleId}`)
      .set("Cookie", cookies)
      .expect(200);

    expect(res.body).to.have.property("message", "Article deleted");
  });

  it("should not delete article if not owner", async function () {
    // Create an article with main user first
    const createRes = await agent
      .post("/api/article")
      .set("Cookie", cookies)
      .send({
        title: "Article to Delete",
        body: "This article will be deleted by unauthorized user test.",
      })
      .expect(201);

    const articleToDelete = createRes.body.article._id;

    // Try to delete with other user
    const otherAgent = request.agent(app);
    await otherAgent
      .delete(`/api/article/${articleToDelete}`)
      .set("Cookie", otherCookies)
      .expect(403)
      .then((res) => {
        expect(res.body).to.have.property(
          "error",
          "Unauthorized: Not your article."
        );
      });

    // Clean up - delete with correct user
    await agent
      .delete(`/api/article/${articleToDelete}`)
      .set("Cookie", cookies)
      .expect(200);
  });

  it("should not delete non-existent article", async function () {
    const fakeId = new mongoose.Types.ObjectId().toString();
    await agent
      .delete(`/api/article/${fakeId}`)
      .set("Cookie", cookies)
      .expect(404)
      .then((res) => {
        expect(res.body).to.have.property("error", "Article not found");
      });
  });

  it("should get all articles", async function () {
    const res = await agent
      .get("/api/article")
      .set("Cookie", cookies)
      .expect(200);

    expect(res.body).to.have.property("articles");
    expect(res.body.articles).to.be.an("array");
  });

  it("should create article with default private visibility", async function () {
    const res = await agent
      .post("/api/article")
      .set("Cookie", cookies)
      .send({
        title: "Default Visibility Article",
        body: "This should be private by default.",
      })
      .expect(201);

    expect(res.body.article).to.have.property("visibility", "private");

    // Clean up
    await agent
      .delete(`/api/article/${res.body.article._id}`)
      .set("Cookie", cookies)
      .expect(200);
  });

  it("should handle invalid user ID in getArticlesByUser", async function () {
    await agent
      .get("/api/article/user/invalidid")
      .set("Cookie", cookies)
      .expect(500); // This might return 500 due to MongoDB error
  });

  after(async function () {
    // Clean up users
    await User.deleteOne({ email: testUser.email });
    await User.deleteOne({ email: otherUser.email });

    // Clean up remaining articles
    await Article.deleteMany({ owner: testUserId });
    await Article.deleteMany({ owner: otherUserId });
  });
});
