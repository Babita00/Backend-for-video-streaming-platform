import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

import cors from "cors";

const app = express(); //creating an express application

app.use(
  cors({
    origin: process.env.CORS_ORIGIN, // Allows you to specify which origins can access your server.
    credentials: true, //This option allows cookies to be included in cross-origin requests. It is necessary when the client and server need to share cookies.
  })
);

app.use(express.json({ limit: "50mb;" }));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ minit: "50mb", extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.static("public"));
app.use(cookieParser());

//routes
import userRoute from "./routes/user.routes.js";

//router declaration
app.use("/api/v1/users", userRoute);
// http://localhost:8000/api/v1/users/register

export { app };
