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
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMTM1Mzg3MjU2ZmMxNDI2MGNjYjQ1MCIsImlhdCI6MTYyOTcwMzUzN30.QvHlmvAFOatTNTlwBL27_kBo3QBPGEkDqPudvYki4gk";
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

    describe("\n PATCH /request/accept || when user tries to accept request", () => {
        test("should respond with a 200 status code", async () => {
            const response = await request(app)
                .patch(baseUrl + `/request/accept/6113fecc260cbe09b007d6c6`)
                .set("authorization", `Bearer ${token}`);
            expect(response.statusCode).toBe(200);
        });
    });

    describe("\n PATCH /request/reject || when user tries to reject request", () => {
        test("should respond with a 200 status code", async () => {
            const response = await request(app)
                .patch(baseUrl + `/request/reject/6113ef1f92fa150090b7ea53`)
                .set("authorization", `Bearer ${token}`);
            expect(response.statusCode).toBe(200);
        });
    });

    describe("\n GET /notification || when user tries to view notifications", () => {
        test("should respond with a 200 status code", async () => {
            const response = await request(app)
                .get(baseUrl + `/notifications`)
                .set("authorization", `Bearer ${token}`);
            expect(response.statusCode).toBe(200);
        });
    });

    describe("\n PATCH /request/edit || when user tries to edit their request", () => {
        test("should respond with a 200 status code", async () => {
            const response = await request(app)
                .patch(baseUrl + `/request/61235219f0d2e91da800feb8`)
                .set("authorization", `Bearer ${token}`)
                .send({
                    proposedExchangeBook: "61235084f0d2e91da800fea6",
                });
            expect(response.statusCode).toBe(200);
        });
    });
});
