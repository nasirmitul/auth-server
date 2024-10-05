import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import routes from "./routes/index.routes.mjs";
import { connectDB } from "../src/db/connectDB.mjs";

dotenv.config();
const app = express();

//middlewares
app.use(express.json()); // allows us to parse incoming requests req.body
app.use(cookieParser()); // allows us to parse cookies

//routes
app.use("/api", routes);

//port
const PORT = process.env.PORT || 5000;

//running server
app.listen(PORT, () => {
  connectDB();
  console.log(`Running on Port ${PORT}`);
});
