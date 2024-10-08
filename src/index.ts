import express, { RequestHandler } from "express";
import dotenv from "dotenv";
import { rateLimiter } from "./middleware/rateLimiter";
import { errorHandler } from "./middleware/errorHandlerMiddleware";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", rateLimiter as RequestHandler, (req, res) => {
  console.log(req.ip);
  res.send("Hello World");
});

app.use(errorHandler);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
