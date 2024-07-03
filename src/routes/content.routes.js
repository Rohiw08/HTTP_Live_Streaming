import { Router } from "express";
import upload from "../middlewares/multer.middleware.js";
import { videoUpload } from "../controllers/content.controller.js";
import express from "express";
import queue from "express-queue";

const app = express();

const router = new Router();

app.use((req, res, next) => {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    );
    next();
});

router.route("/upload").post(
    queue({ activeLimit: 5, queuedLimit: -1 }),
    upload.single("video"),
    videoUpload
  );

export default router;