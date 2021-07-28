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
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwZmVkNzE5YThlNjE1MDAxYzkzNTU3YSIsImlhdCI6MTYyNzQ4MDc1Mn0.ic4EmUh9tsHVLM7jNMouOvHVPOAPtDm4qVQTIQVQul0";

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
