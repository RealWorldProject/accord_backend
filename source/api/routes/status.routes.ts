import express, { Request, Response, NextFunction } from "express";
import { SUCCESS } from "../constants/status-codes.constants";
const statusRoutes = express.Router();

statusRoutes.get("/status", async (req: Request, res: Response) => {
    res.status(SUCCESS).json({ status: "Success!! APIs are working" });
});

export = statusRoutes;
