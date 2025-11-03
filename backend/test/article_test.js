// const chai = require("chai");
// const expect = chai.expect;
// const request = require("supertest");
// const app = require("../app.js");

// describe("Protected article routes", () => {
//   let agent = request.agent(app);

//   before(async function () {
//     await agent
//       .post("/auth/login")
//       .send({ email: "test@example.com", password: "testpassword" })
//       .expect(200);
//   });

//   it("Should create a new article", async function () {
//     const res = await agent
//       .post("/article")
//       .send({
//         title: "With Cookie Article",
//         body: "Article with cookie login.",
//         visibility: "public",
//       })
//       .expect(201);
//   });
// });
