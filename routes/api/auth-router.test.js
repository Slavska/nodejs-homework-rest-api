import mongoose from "mongoose";
import "dotenv/config";
import request from "supertest";

import app from "../../app.js";

import User from "../../models/user.js";

const { PORT, DB_HOST_TEST } = process.env;

describe("test signup", () => {
  let server = null;

  beforeAll(async () => {
    await mongoose.connect(DB_HOST_TEST);
    server = app.listen(PORT);
  });

  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  beforeEach(() => {});

  afterEach(async () => {
    await User.deleteMany({});
  });

  test("test signup with correct data", async () => {
    const requestData = {
      name: "Bogdan",
      email: "bogdan@gmail.com",
      password: "123456",
    };

    const { statusCode, body } = await request(app)
      .post("/api/auth/signup")
      .send(requestData);

    expect(statusCode).toBe(201);
    expect(body.name).toBe(requestData.name);
    expect(body.email).toBe(requestData.email);

    const user = await User.findOne({ email: requestData.email });
    expect(user?.name).toBe(requestData.name);
  });
});
