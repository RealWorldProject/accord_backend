import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import userRoutes from "../api/routes/user.routes";
import postBookRoutes from "../api/routes/postBook.routes";
import dotenv from "dotenv";
import path from "path";
import categoryRoutes from "../api/routes/category.routes";
import uploadRoutes from "../api/routes/upload.routes";
import statusRoutes from "../api/routes/status.routes";
import cors from "cors";
import cartRoutes from "../api/routes/cart.routes";
import orderRoutes from "../api/routes/order.routes";
import requestRoutes from "../api/routes/request.routes";
import reviewRoutes from "../api/routes/review.routes";

const VERSION = "/api/v1";

const app = express();

const env = process.env.NODE_ENV;

// cors
app.use(cors());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: false }));

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
app.use(VERSION, statusRoutes);
app.use(VERSION, userRoutes);
app.use(VERSION, postBookRoutes);
app.use(VERSION, categoryRoutes);
app.use(VERSION, uploadRoutes);
app.use(VERSION, cartRoutes);
app.use(VERSION, orderRoutes);
app.use(VERSION, requestRoutes);
app.use(VERSION, reviewRoutes);

// const mongoURI =
//     process.env.MONGO_URI ||
//     "mongodb+srv://accord:@gileGroup1@accord.opzad.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
// database(mongoURI);

export default app;
