import request from "supertest";
import app from "../app/app";
import mongoose from "mongoose";

beforeAll(async () => {
    await mongoose.connect(
        "mongodb+srv://accord:@gileGroup1@accord.opzad.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
        {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
        }
    );
});
afterAll(async () => {
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

    const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwZmVkNzE5YThlNjE1MDAxYzkzNTU3YSIsImlhdCI6MTYyNzY1ODExN30.2Atq4eBDcomZ6myM1z_2aO1tpT9ofCElaV_cDp15nq8";

    describe("when users try to view profile", () => {
        test("should respond with a 200 status code", async () => {
            const response = await request(app)
                .get("/api/v1/user/profile/60fed719a8e615001c93557a")
                .set("authorization", "Bearer " + token);
            console.log(response.body);

            expect(response.statusCode).toBe(200);
        });
    });
});
