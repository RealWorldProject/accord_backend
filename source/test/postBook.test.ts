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

const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwZjk2ZGNlOGQxOTA1MjE2MDk5YjViMCIsImlhdCI6MTYyNjk2MzU4OX0.Rj81c0_HQsgpP-oX9aBOS6iuxJzyxE_8CUykN_WmNpU";

describe("APIs /bookPost", () => {
    describe("when user tries to post a book", () => {
        test("should respond with a 201 status code", async () => {const response = await request(app)
                .post("/api/v1/book")
                .set("authorization", "Bearer " + token)
                .send({
                    name: "Small Data",
                    price: 1200,
                    images: [
                        "https://cdn.elearningindustry.com/wp-content/uploads/2016/05/top-10-books-every-college-student-read-e1464023124869.jpeg",
                        "https://www.incimages.com/uploaded_files/image/1024x576/getty_883231284_200013331818843182490_335833.jpg",
                    ],
                    description: "The tiny clues that uncover huge trends",
                    author: "Martin Lindstrom",
                    category: "60eee34135aece0f64ea5f69",
                });
            console.log(response);
            expect(response.statusCode).toBe(201);
        });
    });

    describe("\nGET /book || When admin tries to verify book", () => {
        test("should ")
    })
    

    describe("\nGET /books/:categoryID || When user clicks on specific category in home_screen", () => {
        test("should display the every books referenced to that category.", async () => {
            
            const response = await request(app)
                .get("api/v1/books/60f930a3d1579a01fc3ca985")
                .set("authorization", `Bearer ${token}`);
            expect(response.statusCode).toBe(200);
        });
    });
});
