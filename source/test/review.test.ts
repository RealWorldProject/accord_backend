import request from "supertest";
import app from "../app/app";
import mongoose from "mongoose";

beforeAll(async () => {
    try {
        await mongoose.connect(
            "mongodb+srv://accord:@gileGroup1@accord.opzad.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
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
    await mongoose.connection.close();
});

const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwZjk2ZGNlOGQxOTA1MjE2MDk5YjViMCIsImlhdCI6MTYyODYxOTE2M30.yD1a5OBzvNuLjp-WZkMu0X9VnszAMC1lBGKG3hja8TI";

// BASE URL
const baseUrl = "/api/v1/";

describe("APIs /reviews", () => {
    describe("\n POST /review/add || when user tries to give reviews and ratings to a book", () => {
        test("should respond with a 201 status code", async () => {
            const response = await request(app)
                .post(baseUrl + `/review/6117dd757e300f1f1c60b66c`)
                .set("authorization", `Bearer ${token}`)
                .send({
                    review: "Best documentary book about the best football player ever to grace the game.",
                    rating: "5",
                });
            expect(response.statusCode).toBe(201);
        });
    });

    describe("\n GET /review/get || when user tries to view reviews and ratings of the book", () => {
        test("should respond with a 200 status code", async () => {
            const response = await request(app)
                .get(baseUrl + `/review/6117dd757e300f1f1c60b66c`)
                .set("authorization", `Bearer ${token}`);
            expect(response.statusCode).toBe(200);
        });
    });

    describe("\n PATCH /review/edit || when user tries to edit reviews and ratings of the book", () => {
        test("should respond with a 200 status code", async () => {
            const response = await request(app)
                .get(baseUrl + `/review/611e018e1e8e6f370825695c`)
                .set("authorization", `Bearer ${token}`);
            expect(response.statusCode).toBe(200);
        });
    });
});
