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

describe("APIs /categories", () => {
    describe("when admin tries to add categories", () => {
        test("should respond with a 201 status code", async () => {
            const response = await request(app)
                .post("/api/v1/category")
                .attach("authorization", "Bearer token paste garna paryo")
                .send({
                    category: "Non Fiction",
                    slug: "non-fiction",
                    image: "http://randomimage.com/",
                });
            expect(response.statusCode).toBe(201);
        });
    });
});
