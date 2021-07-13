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

describe("APIs /bookPost", () => {
    describe("when user tries to post a book", () => {
        test("should respond with a 201 status code", async () => {
            const response = await request(app)
                .post("/api/v1/post-book")
                .set("authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwZTU5NmFkOWNkOTgwMThhMDc4YzJiMiIsImlhdCI6MTYyNTgyNTkwM30.as5jEPYt1LI2C4kR_1pJcCONnhV_eIvC07W60REqDO0")
                .send({
                    name: "Small Data",
                    price: "1200",
                    image: "http://randomimage.com/",
                    description:"The tiny clues that uncover huge trends",
                    author:"Martin Lindstrom",
                    category: "id"
                });
                expect(response.statusCode).toBe(201);
        });
    });
});


