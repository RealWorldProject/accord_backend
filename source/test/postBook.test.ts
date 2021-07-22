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
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwZjkxMzEwZDE1NzlhMDFmYzNjYTk3YiIsImlhdCI6MTYyNjkzNjA4MH0.sFLUJObq4MqGvowxIzob_lkWYkIn00xMCIv47mBPDo0";

describe("APIs /bookPost", () => {
    describe("when user tries to post a book", () => {
        test("should respond with a 201 status code", async () => {
            const response = await request(app)
                .post("/api/v1/book")
                .set("authorization", "Bearer " + token)
                .send({
                    name: "Small Data Test",
                    price: 1200,
                    images: [
                        "https://upload.wikimedia.org/wikipedia/en/9/9c/Smalldatathetinycluesthatuncoverhugetrends.jpg",
                    ],
                    description: "The tiny clues that uncover huge trends",
                    author: "Martin Lindstrom",
                    category: "60f930a3d1579a01fc3ca985",
                    isNew: true,
                    isAvailableForExchange: true,
                });
            expect(response.statusCode).toBe(201);
        });
    });

    describe("\nPATCH /book/accept || When admin tries to verify book", () => {
        test("should return 200 response", async () => {
            const response = await request(app)
                .patch("/api/v1/book/accept/60f93a66d1579a01fc3ca99e")
                .set("authorization", `Bearer ${token}`);
            expect(response.statusCode).toBe(200);
        });
    });

    describe("\nPATCH /book/reject || When admin tries to reject book", () => {
        test("should return 200 response", async () => {
            const response = await request(app)
                .patch("/api/v1/book/reject/60f93a66d1579a01fc3ca99e")
                .set("authorization", `Bearer ${token}`)
                .send({ rejectionMessage: "This is for Testing" });

            console.log(response.body);
            expect(response.statusCode).toBe(200);
        });
    });

    describe("\nGET /books || When user clicks on specific category in home_screen", () => {
        test("should display the every books referenced to that category.", async () => {
            const response = await request(app)
                .get("/api/v1/books")
                .set("authorization", `Bearer ${token}`);
            expect(response.statusCode).toBe(200);
        });
    });
});
