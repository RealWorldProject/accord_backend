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

// USER TOKEN
const userToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwZjk2ZGNlOGQxOTA1MjE2MDk5YjViMCIsImlhdCI6MTYyODE4MjU1OX0.8d9t9k6jrop0D608XpZIT1M1rOU_WiiYfdJcnKwFtG8";

// ADMIN TOKEN
const adminToken = "";

// BASE URL
const baseUrl = "/api/v1/";

describe("APIs /orders", () => {
    describe("\n POST /order || when user tries to add an order", () => {
        test("should respond with a 201 status code", async () => {
            const response = await request(app)
                .post(baseUrl + `/order`)
                .set("authorization", `Bearer ${userToken}`)
                .send({
                    fullName: "Test",
                    phoneNumber: "9860180332",
                    state: "Bagmati",
                    city: "Banepa",
                    area: "Tindobato",
                    address: "nepal",
                    coordinates: "jjsjsjs,kakakka",
                    paymentGateway: "COD",
                });
            expect(response.statusCode).toBe(201);
        });
    });

    describe("\n POST /order || when admin tries to view an orders", () => {
        test("should respond with a 200 status code", async () => {
            const response = await request(app)
                .get(baseUrl + `/order`)
                .set("authorization", `Bearer ${adminToken}`)
                .expect("Content-Type", /json/);
            expect(response.statusCode).toBe(200);
        });
    });
});
