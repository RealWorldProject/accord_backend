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
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwZjkxMzEwZDE1NzlhMDFmYzNjYTk3YiIsImlhdCI6MTYyODA5NDIwNX0.j6Q0NOkc3EVxlVFWmU79LBcWvO_AnK5la4dkOgFBYW0";
    describe("when users try to view profile", () => {
        test("should respond with a 200 status code", async () => {
            const response = await request(app)
                .get("/api/v1/user/profile/60fed719a8e615001c93557a")
                .set("authorization", "Bearer " + token);

            expect(response.statusCode).toBe(200);
        });
    });

    describe("\n GET /users || When admin tries to view users", () => {
        test("should respond with a 200 status code", async () => {
            const response = await request(app)
                .get("/api/v1/users")
                .set("authorization", "Bearer " + token);

            expect(response.statusCode).toBe(200);
        });
    });

    describe("\nPATCH /user/suspend || When admin tries to suspend user", () => {
        test("should return 200 response", async () => {
            const response = await request(app)
                .patch("/api/v1/user/suspend/610aabb5b490b03fe06081e2")
                .set("authorization", "Bearer " + token)
                .send({
                    suspensionMessage: "This is for Testing",
                });
            expect(response.statusCode).toBe(200);
        });
    });
});
