import request from "supertest";
import app from "../app/app";
import mongoose from "mongoose";

beforeAll(async () => {
    try {
        await mongoose.connect(
            "mongodb+srv://accord:@gileGroup1@accord.opzad.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
            // "mongodb://localhost:27017/test",
            {
                useNewUrlParser: true,
                useCreateIndex: true,
                useUnifiedTopology: true,
            }
        );
    } catch (error) {
        console.log(error);
    }
});
afterAll(async () => {
    // await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
});

const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwZmVkNzE5YThlNjE1MDAxYzkzNTU3YSIsImlhdCI6MTYyNzU3MDU5M30.nr36an1W5DnhNOPINIn35w6b3AOjDnH5XmdyEs8b6Ho";

describe("APIs /addToCart", () => {
    describe("when user tries to add book to cart", () => {
        test("should respond with a 200 status code", async () => {
            const response = await request(app)
                .post("/api/v1/cart")
                .set("authorization", "Bearer " + token)
                .send({
                    bookID: "60f99c35607d842a64939da0",
                    quantity: 1,
                });
            expect(response.statusCode).toBe(200);
        });
    });
});

describe("APIs /viewCart", () => {
    describe("when user tries to view the book in their cart", () => {
        test("should respond with a 200 status code", async () => {
            const response = await request(app)
                .get("/api/v1/cart")
                .set("authorization", "Bearer " + token)
                
            expect(response.statusCode).toBe(200);
        });
    });
});
