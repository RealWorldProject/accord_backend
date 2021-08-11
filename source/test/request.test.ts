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

describe("APIs /requests", () => {
    describe("\n POST /request || when user tries to request a book", () => {
        test("should respond with a 200 status code", async () => {
            const response = await request(app)
                .post(baseUrl + `/request`)
                .set("authorization", `Bearer ${token}`)
                .send({
                    proposedExchangeBook: "60f97a5e6b4ada4cf488c74c",
                    requestedBook: "60ff7da48eda85001c3de8f1",
                });
            expect(response.statusCode).toBe(200);
        });
    });

    describe("\n GET /request/incoming || when user tries to view incoming request", () => {
        test("should respond with a 200 status code", async () => {
            const response = await request(app)
                .get(baseUrl + `/request/incoming`)
                .set("authorization", `Bearer ${token}`);
            expect(response.statusCode).toBe(200);
        });
    });

    describe("\n GET /request/my || when user tries to view their own created request", () => {
        test("should respond with a 200 status code", async () => {
            const response = await request(app)
                .get(baseUrl + `/request/my`)
                .set("authorization", `Bearer ${token}`);
            expect(response.statusCode).toBe(200);
        });
    });
});
