const chai = require("chai");
const expect = chai.expect;
const request = require("supertest");
const app = require("../app.js");
const mongoose = require("mongoose");
const User = require("../src/models/user.js");
const Summary = require("../src/models/summary.js");

describe("Summary Routes", function () {
  this.timeout(40000);

  let agent = request.agent(app);
  let cookies;
  let testUserId;
  let createdSummaryId;

  const signupData = {
    username: "sumuser12",
    email: "sumuser12@example.com",
    password: "supersecret129",
  };

  before(async function () {
    await User.deleteOne({ email: signupData.email });
    const signupRes = await agent
      .post("/api/auth/signup")
      .send(signupData)
      .expect(201);
    expect(signupRes.body).to.have.property("user");
    testUserId = signupRes.body.user.id;

    const loginRes = await agent
      .post("/api/auth/login")
      .send({ email: signupData.email, password: signupData.password })
      .expect(200);
    console.log("signup and login done ");

    cookies = loginRes.headers["set-cookie"];
    expect(cookies).to.be.an("array").that.is.not.empty;
    cookies = cookies.join("; ");
  });

  it("should create a new summary", async function () {
    const res = await agent
      .post("/api/summary")
      .set("Cookie", cookies)
      .send({ originalText: "Testing summary creation route." })
      .expect(201);

    expect(res.body).to.have.property(
      "message",
      "Summary created successfully"
    );
    expect(res.body).to.have.property("summary");
    expect(res.body.summary).to.have.property(
      "originalText",
      "Testing summary creation route."
    );

    expect(res.body.summary).to.have.property("summaryText");
    expect(res.body.summary).to.have.property("user");
    createdSummaryId = res.body.summary._id;
  });

  it("should get summaries by user", async function () {
    const res = await agent
      .get(`/api/summary/user/${testUserId}`)
      .set("Cookie", cookies)
      .expect(200);
    expect(res.body).to.have.property("summaries");
    expect(res.body.summaries).to.be.an("array");
    expect(res.body.summaries[0]).to.have.property("originalText");
  });

  it("should get single summary by ID", async function () {
    const res = await agent
      .get(`/api/summary/${createdSummaryId}`)
      .set("Cookie", cookies)
      .expect(200);
    expect(res.body).to.have.property("summary");
    expect(res.body.summary).to.have.property("_id", createdSummaryId);
  });

  it("should delete a summary", async function () {
    const res = await agent
      .delete(`/api/summary/${createdSummaryId}`)
      .set("Cookie", cookies)
      .expect(200);
    expect(res.body).to.have.property("message", "Summary deleted");
  });

  it("should not create summary with missing text", async function () {
    await agent
      .post("/api/summary")
      .set("Cookie", cookies)
      .send({})
      .expect(400)
      .then((res) => {
        expect(res.body).to.have.property("error", "Text is required.");
      });
  });

  it("should not allow summary creation if not authenticated", async function () {
    await request(app)
      .post("/api/summary")
      .send({ originalText: "Unauthenticated test text." })
      .expect(401)
      .then((res) => {
        expect(res.body).to.have.property("message", "No access token.");
      });
  });

  it("should error when getting summary by non-existent ID", async function () {
    const fakeId = new mongoose.Types.ObjectId().toString();
    await agent
      .get(`/api/summary/${fakeId}`)
      .set("Cookie", cookies)
      .expect(404)
      .then((res) => {
        expect(res.body).to.have.property("error", "Summary not found");
      });
  });

  it("should error when getting summaries by invalid userId", async function () {
    await agent
      .get(`/api/summary/user/notavalidid`)
      .set("Cookie", cookies)
      .expect(400)
      .then((res) => {
        expect(res.body).to.have.property("error", "Invalid user id");
      });
  });

  it("should error when getting summaries by non-existent user", async function () {
    const fakeUserId = new mongoose.Types.ObjectId().toString();
    await agent
      .get(`/api/summary/user/${fakeUserId}`)
      .set("Cookie", cookies)
      .expect(404)
      .then((res) => {
        expect(res.body).to.have.property("error", "User not found");
      });
  });

  it("should error when trying to delete a non-existent summary", async function () {
    const fakeId = new mongoose.Types.ObjectId().toString();
    await agent
      .delete(`/api/summary/${fakeId}`)
      .set("Cookie", cookies)
      .expect(404)
      .then((res) => {
        expect(res.body).to.have.property("error", "Summary not found");
      });
  });

  it("should error when unauthorized user tries to delete another's summary", async function () {
    const otherUser = {
      username: "otheruser40",
      email: "otheruser40@example.com",
      password: "otheruserpass40",
    };
    await User.deleteOne({ email: otherUser.email });

    const otherAgent = request.agent(app);
    const signup = await otherAgent
      .post("/api/auth/signup")
      .send(otherUser)
      .expect(201);
    const login = await otherAgent
      .post("/api/auth/login")
      .send({ email: otherUser.email, password: otherUser.password })
      .expect(200);
    const otherCookies = login.headers["set-cookie"];
    expect(otherCookies).to.be.an("array").that.is.not.empty;
    const otherCookiesStr = otherCookies.join("; ");

    const createRes = await agent
      .post("/api/summary")
      .set("Cookie", cookies)
      .send({ originalText: "Testing unauthorized" })
      .expect(201);
    const unauthorizedSummaryId = createRes.body.summary._id;

    await otherAgent
      .delete(`/api/summary/${unauthorizedSummaryId}`)
      .set("Cookie", otherCookiesStr)
      .expect(403)
      .then((res) => {
        expect(res.body).to.have.property(
          "error",
          "Unauthorized: Not your summary."
        );
      });

    await User.deleteOne({ email: otherUser.email });
    await Summary.findByIdAndDelete(unauthorizedSummaryId);
  });

  it("should return paginated summaries for user", async function () {
    this.timeout(60000);
    for (let i = 0; i < 8; i++) {
      await agent
        .post("/api/summary")
        .set("Cookie", cookies)
        .send({ originalText: `Paginated test summary ${i}` })
        .expect(201);
    }

    const res = await agent
      .get(`/api/summary/user/${testUserId}?limit=3&page=2`)
      .set("Cookie", cookies)
      .expect(200);

    expect(res.body).to.have.property("summaries");
    expect(res.body).to.have.property("total");
    expect(res.body).to.have.property("page", 2);
    expect(res.body).to.have.property("limit", 3);
    expect(res.body.summaries).to.be.an("array").with.lengthOf(3);

    const ascRes = await agent
      .get(`/api/summary/user/${testUserId}?limit=3&page=1&sort=asc`)
      .set("Cookie", cookies)
      .expect(200);
    expect(ascRes.body.summaries[0].originalText).to.equal(
      "Paginated test summary 0"
    );

    const descRes = await agent
      .get(`/api/summary/user/${testUserId}?limit=3&page=3&sort=desc`)
      .set("Cookie", cookies)
      .expect(200);
    expect(descRes.body.summaries[0].originalText).to.match(
      /Paginated test summary [0-9]/
    );

    const allSummaries = await Summary.find({ user: testUserId });
    for (const s of allSummaries) {
      if (s.originalText.startsWith("Paginated test summary")) {
        await Summary.findByIdAndDelete(s._id);
      }
    }
  });

  after(async function () {
    await User.deleteOne({ email: signupData.email });
    await Summary.deleteMany({ user: testUserId });
  });
});
