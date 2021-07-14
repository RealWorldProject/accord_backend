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
                .post("/api/v1/book")
                .set(
                    "authorization",
                    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwZWVlMWE0ODM2NzA4M2E0Y2UzZWMwYiIsImlhdCI6MTYyNjI3Njk5N30.V3Yq6XguNjy5bD8K72FdypNnrvK-2jw774rDJQj0810"
                )
                .send({
                    name: "Small Data",
                    price: 1200,
                    image: [
                        "https://cdn.elearningindustry.com/wp-content/uploads/2016/05/top-10-books-every-college-student-read-e1464023124869.jpeg",
                        "https://www.incimages.com/uploaded_files/image/1024x576/getty_883231284_200013331818843182490_335833.jpg",
                    ],
                    description: "The tiny clues that uncover huge trends",
                    author: "Martin Lindstrom",
                    category: "60eee34135aece0f64ea5f69",
                });
            expect(response.statusCode).toBe(201);
        });
    });
});
