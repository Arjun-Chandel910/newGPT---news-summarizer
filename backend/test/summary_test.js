const chai = require("chai");
const expect = chai.expect;
const request = require("supertest");
const app = require("../app.js");
const mongoose = require("mongoose");

describe("Summary Routes", function () {
  this.timeout(10000); // hugging face api is taking more time so increasing the time
  let agent = request.agent(app);
  let cookies;
  let createdSummaryId;
  let testUserId;
  let testUser = {
    username: "summaryuser3",
    email: "summaryuser3@test.com",
    password: "summarypass",
  };

  // signup and login
  before(async function () {
    const signupRes = await agent
      .post("/api/auth/signup")
      .send(testUser)
      .expect(201);
    testUserId = signupRes.body.user.id;
    const loginRes = await agent
      .post("/api/auth/login")
      .send({ email: testUser.email, password: testUser.password })
      .expect(200);

    cookies = loginRes.headers["set-cookie"];
  });

  it("should create a new summary", async function () {
    const res = await agent
      .post("/api/summary")
      .set("Cookie", cookies)
      .send({
        originalText: "This is some text to be summarized for testing.",
      })
      .expect(201);
    expect(res.body).to.have.property(
      "message",
      "Summary created successfully"
    );
    expect(res.body).to.have.property("summary");
    expect(res.body.summary).to.have.property(
      "originalText",
      "This is some text to be summarized for testing."
    );
    expect(res.body.summary).to.have.property("summaryText");
    createdSummaryId = res.body.summary._id;
  });

  it("should get summaries by user", async function () {
    const userId = testUserId;
    const res2 = await agent
      .get(`/api/summary/user/${userId}`)
      .set("Cookie", cookies)
      .expect(200);
    expect(res2.body).to.have.property("summaries");
    expect(res2.body.summaries).to.be.an("array");
    expect(res2.body.summaries[0]).to.have.property("originalText");
  });

  it("should get single summary by ID", async function () {
    const res = await agent
      .get(`/api/summary/${createdSummaryId}`)
      .set("Cookie", cookies)
      .expect(200);
    expect(res.body).to.have.property("summary");
    expect(res.body.summary._id).to.equal(createdSummaryId);
  });

  it("should delete a summary", async function () {
    const res = await agent
      .delete(`/api/summary/${createdSummaryId}`)
      .set("Cookie", cookies)
      .expect(200);
    expect(res.body).to.have.property("message", "Summary deleted");
  });

  //missing originalText
  it("should not create summary with missing text", async function () {
    await agent
      .post("/api/summary")
      .set("Cookie", cookies)
      .send({})
      .expect(400);
  });

  //access not given
  it("should not allow summary creation if not authenticated", async function () {
    await request(app)
      .post("/api/summary")
      .send({ originalText: "Unauthenticated test text." })
      .expect(401);
  });
});
