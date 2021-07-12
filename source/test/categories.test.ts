import request from "supertest";
import app from "../app/app";
import mongoose from "mongoose";

beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017/test_database", {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
    });
});
afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
});

describe("POST /user", () => {
    describe("when users try to register", () => {
        test("should respond with a 201 status code", async () => {
            const response = await request(app)
                .post("/api/v1/user/register")
                .send({
                    email: "testing@testing.com",
                    password: "testing",
                });
            expect(response.statusCode).toBe(201);
        });
    });

    describe("when users try to login", () => {
        test("should respond with a 200 status code", async () => {
            const response = await request(app)
                .post("/api/v1/user/login")
                .send({
                    email: "testing@testing.com",
                    password: "testing",
                });
            expect(response.statusCode).toBe(200);
        });
    });
});
