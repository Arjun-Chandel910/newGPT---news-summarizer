const chai = require("chai");
const expect = chai.expect;
const request = require("supertest");
const app = require("../app.js");

describe("Protected article routes", () => {
  let agent = request.agent(app);

  before(async function () {
    await agent
      .post("/auth/login")
      .send({ email: "test@example.com", password: "testpassword" })
      .expect(200);
  });
});
