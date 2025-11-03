const chai = require("chai");
const expect = chai.expect;
const request = require("supertest");
const app = require("../app.js");

describe("Authentication/User routes", function () {
  let agent = request.agent(app);
  const signupData = {
    username: "testuser3",
    email: "testuser3@example.com",
    password: "supersecret123",
  };
  let cookies;

  // signup
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
    cookies = res.headers["set-cookie"];
    expect(cookies.some((c) => c.startsWith("access_token"))).to.be.true;
    expect(cookies.some((c) => c.startsWith("refresh_token"))).to.be.true;
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
    const res = await agent
      .post("/api/auth/login")
      .send({
        email: signupData.email,
        password: signupData.password,
      })
      .expect(200);

    expect(res.body).to.have.property("message", "Logged in successfully!");
    expect(res.body).to.have.property("user");
    expect(res.body.user).to.have.property("email", signupData.email);
    cookies = res.headers["set-cookie"];
    expect(cookies.some((c) => c.startsWith("access_token"))).to.be.true;
    expect(cookies.some((c) => c.startsWith("refresh_token"))).to.be.true;
  });

  it("should fail login with incorrect password", async function () {
    const res = await agent
      .post("/api/auth/login")
      .send({
        email: signupData.email,
        password: "3jadsfl",
      })
      .expect(401);
    expect(res.body).to.have.property("message", "Invalid email or password.");
  });

  it("should get current user with access token", async function () {
    const res = await agent
      .get("/api/auth/me")
      .set("Cookie", cookies)
      .expect(200);

    expect(res.body).to.have.property("user");
    expect(res.body.user).to.have.property("username", signupData.username);
    expect(res.body.user).to.have.property("email", signupData.email);
  });

  it("should refresh access token with refresh token", async function () {
    const res = await agent
      .post("/api/auth/refresh")
      .set("Cookie", cookies)
      .expect(200);

    expect(res.body).to.have.property(
      "message",
      "Access token refreshed successfully."
    );
    expect(res.headers["set-cookie"].some((c) => c.startsWith("access_token")))
      .to.be.true;
  });

  it("should logout and clear cookies", async function () {
    const res = await agent
      .post("/api/auth/logout")
      .set("Cookie", cookies)
      .expect(200);

    expect(res.body).to.have.property("message", "Logged out successfully.");
    expect(res.headers["set-cookie"].some((c) => c.includes("access_token=;")))
      .to.be.true;
    expect(res.headers["set-cookie"].some((c) => c.includes("refresh_token=;")))
      .to.be.true;
  });
});
