const chai = require("chai");
const expect = chai.expect;
const request = require("supertest");
const app = require("../app.js");
const User = require("../src/models/user.js");

describe("Authentication/User routes", function () {
  this.timeout(10000);
  let agent = request.agent(app);
  let cookies;
  let testUserId;

  const signupData = {
    username: "testuser11",
    email: "testuser11@example.com",
    password: "supersecret123",
  };

  before(async function () {
    await User.deleteOne({ email: signupData.email });
  });

  it("should register a new user and set cookies", async function () {
    const res = await agent
      .post("/api/auth/signup")
      .send(signupData)
      .expect(201);

    expect(res.body).to.have.property(
      "message",
      "User registered successfully"
    );
    expect(res.body).to.have.property("user");
    expect(res.body.user).to.have.property("id");
    expect(res.body.user).to.have.property("username", signupData.username);
    expect(res.body.user).to.have.property("email", signupData.email);
    testUserId = res.body.user.id;
    cookies = res.headers["set-cookie"];
    expect(cookies.some((c) => c.startsWith("access_token"))).to.be.true;
    expect(cookies.some((c) => c.startsWith("refresh_token"))).to.be.true;
    cookies = cookies.join("; ");
  });

  it("should not register with missing fields", async function () {
    const res = await agent
      .post("/api/auth/signup")
      .send({ username: "missingemail" })
      .expect(400);
    expect(res.body).to.have.property("error", "All fields are required!");
  });

  it("should not allow duplicate registration", async function () {
    await agent
      .post("/api/auth/signup")
      .send(signupData)
      .expect(400)
      .then((res) => {
        expect(res.body).to.have.property("error", "User already exists!");
      });
  });

  // login
  it("should login a user and set cookies", async function () {
    const loginAgent = request.agent(app);
    const res = await loginAgent
      .post("/api/auth/login")
      .send({
        email: signupData.email,
        password: signupData.password,
      })
      .expect(200);

    expect(res.body).to.have.property("message", "Logged in successfully!");
    expect(res.body).to.have.property("user");
    expect(res.body.user).to.have.property("email", signupData.email);
    const loginCookies = res.headers["set-cookie"];
    expect(loginCookies.some((c) => c.startsWith("access_token"))).to.be.true;
    expect(loginCookies.some((c) => c.startsWith("refresh_token"))).to.be.true;
  });

  it("should fail login with incorrect password", async function () {
    const res = await agent
      .post("/api/auth/login")
      .send({
        email: signupData.email,
        password: "3jadsfl",
      })
      .expect(401);
    expect(res.body).to.have.property("error", "Invalid email or password.");
  });

  it("should get current user with access token", async function () {
    const authAgent = request.agent(app);
    const loginRes = await authAgent
      .post("/api/auth/login")
      .send({
        email: signupData.email,
        password: signupData.password,
      })
      .expect(200);

    const authCookies = loginRes.headers["set-cookie"].join("; ");

    const res = await authAgent
      .get("/api/auth/me")
      .set("Cookie", authCookies)
      .expect(200);

    expect(res.body).to.have.property("user");
    expect(res.body.user).to.have.property("username", signupData.username);
    expect(res.body.user).to.have.property("email", signupData.email);
  });

  it("should refresh access token with refresh token", async function () {
    const authAgent = request.agent(app);
    const loginRes = await authAgent
      .post("/api/auth/login")
      .send({
        email: signupData.email,
        password: signupData.password,
      })
      .expect(200);

    const authCookies = loginRes.headers["set-cookie"].join("; ");

    const res = await authAgent
      .post("/api/auth/refresh")
      .set("Cookie", authCookies)
      .expect(200);

    expect(res.body).to.have.property(
      "message",
      "Access token refreshed successfully."
    );
    expect(res.headers["set-cookie"].some((c) => c.startsWith("access_token")))
      .to.be.true;
  });

  it("should logout and clear cookies", async function () {
    const authAgent = request.agent(app);
    const loginRes = await authAgent
      .post("/api/auth/login")
      .send({
        email: signupData.email,
        password: signupData.password,
      })
      .expect(200);

    const authCookies = loginRes.headers["set-cookie"].join("; ");

    const res = await authAgent
      .post("/api/auth/logout")
      .set("Cookie", authCookies)
      .expect(200);

    expect(res.body).to.have.property("message", "Logged out successfully.");
    expect(res.headers["set-cookie"].some((c) => c.includes("access_token=;")))
      .to.be.true;
    expect(res.headers["set-cookie"].some((c) => c.includes("refresh_token=;")))
      .to.be.true;
  });

  after(async function () {
    await User.deleteOne({ email: signupData.email });
  });
});
