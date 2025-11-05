// const chai = require("chai");
// const expect = chai.expect;
// const request = require("supertest");
// const app = require("../app.js");

// describe("Protected article routes", () => {
//   let agent = request.agent(app);

//   let cookies;
//   let createdArticleId;
//   let testUserId;
//   let testUser = {
//     username: "articleuser",
//     email: "articleuser@test.com",
//     password: "articlepass",
//   };

//   // signup and login
//   before(async function () {
//     const signupRes = await agent
//       .post("/api/auth/signup")
//       .send(testUser)
//       .expect(201);
//     testUserId = signupRes.body.user.id;
//     const loginRes = await agent
//       .post("/api/auth/login")
//       .send({ email: testUser.email, password: testUser.password })
//       .expect(200);
//     cookies = loginRes.headers["set-cookie"];
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
