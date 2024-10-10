import express, { RequestHandler } from "express";
import dotenv from "dotenv";
import { rateLimiter } from "./middleware/rateLimiter";
import { errorHandler } from "./middleware/errorHandlerMiddleware";
import smsRoutes from "./routes/smsRoutes";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/health-check", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

app.use("/sms", smsRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
