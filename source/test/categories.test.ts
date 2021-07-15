import request from "supertest";
import app from "../app/app";
import mongoose from "mongoose";

beforeAll(async () => {
    await mongoose.connect(
        "mongodb://localhost:27017/application_development",
        {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
        }
    );
});
afterAll(async () => {
    // await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
});

// admin
// const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwZWVlYzlhNTQ0ZTYyNDNlMGQ0MDg3YyIsImlhdCI6MTYyNjM0MzUwNn0.AJO4D4kvm2M6hJqOYB_taPoCWZ3exGmClQDPeJoOzN4";
// user
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwZWZjOWQxYTM3MjgxMmE2NDA2ZTg2NyIsImlhdCI6MTYyNjM0NDY3M30.h088YofKYCd1sVO275j1ryn3E1oAjtLR7h1uFZ6q5vE";

describe("APIs /categories", () => {
    describe("\nPOST /category || When admin tries to add a category", () => {
        test("should respond with a 201 status code", async () => {
            const response = await request(app)
                .post("/api/v1/category")
                .set("authorization", `Bearer ${token}`)
                .send({
                    category: "test categories",
                    slug: "test-categories",
                    image: "http://randomimage.com/",
                });
            expect(response.statusCode).toBe(201);
        });
    });

    describe("\nGET /categories || When admin/user tries to view categories", () => {
        test("respond with 200 status code & json containing list of categories", async () => {
            const response = await request(app)
                .get("/api/v1/categories")
                .set("authorization", `Bearer ${token}`)
                .expect("Content-Type", /json/);
            expect(response.statusCode).toBe(200);
        });
    });

    describe("\nPUT /categories/:categoryID || When admin tries to update a category", () => {
        test("respond with 200 status code & json containing updated category", async () => {
            const response = await request(app)
                .put("/api/v1/categories/60f01ebecc2834060879cb48")
                .set("authorization", `Bearer ${token}`)
                .send({
                    "category": "abcd",
                    "slug": "abcd",
                    "image": "test.img",
                });
            expect(response.statusCode).toBe(200);
        });
    });

    describe("\nDELETE /categories/:categoryID || When admin tries to delete a category", () => {
        test("respond with 200 status code & json containing deleted category", async () => {
            const response = await request(app)
                .delete("/api/v1/categories/60f01ebecc2834060879cb48")
                .set("authorization", `Bearer ${token}`);
            expect(response.statusCode).toBe(200);
        })
    })
});
