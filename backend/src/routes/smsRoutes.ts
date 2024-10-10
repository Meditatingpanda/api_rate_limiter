import express, { RequestHandler } from "express";
import { smsController } from "../controller/smsController";
import { rateLimiter } from "../middleware/rateLimiter";

const router = express.Router();

router.post("/send", rateLimiter as RequestHandler, smsController.sendSms);

router.get("/total-sms-sent", smsController.getSmsSent);

router.get("/rate-limit-status", smsController.getRateLimitStatus);

router.get("/get-all-sms", smsController.getAllSms);


export default router;
