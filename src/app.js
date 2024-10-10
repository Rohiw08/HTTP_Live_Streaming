import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import 'dotenv/config'

const app = express()

app.use(cors({
    origin: "*",
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use("/backend/src/uploads",express.static("uploads"))
app.use(cookieParser())

// routes
import userRouter from './routes/user.routes.js'
import videoRoute from './routes/content.routes.js';

// routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/video", videoRoute);

export {app}


// app.use('/up', express.static('/home/rohit/node_projects/random_project/backend/src/public/temp/dummy.mp4'), {
//     setHeaders: (res) => {
//       res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
//     },
// });