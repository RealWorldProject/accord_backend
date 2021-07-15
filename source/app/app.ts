import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import userRoutes from "../api/routes/user.routes";
import postBookRoutes from "../api/routes/postBook.routes";
import dotenv from "dotenv";
import path from "path";
import categoryRoutes from "../api/routes/category.routes";

const VERSION = "/api/v1";

const app = express();

const env = process.env.NODE_ENV;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

if (env === "development") {
    app.use(morgan("dev"));
}

// setting up the environment variables according to the environment i.e production/ development
if (env === "development") {
    dotenv.config({
        path: path.join(__dirname, "../", "../", ".env.development"),
    });
} else {
    dotenv.config({
        path: path.join(__dirname, "../", "../", ".env.production"),
    });
}

// adding routes
app.use(VERSION, userRoutes);
app.use(VERSION, postBookRoutes);
app.use(VERSION, categoryRoutes);

export default app;
