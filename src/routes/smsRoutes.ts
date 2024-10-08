import express from "express";

const router = express.Router();

router.post("/send-sms", (req, res) => {
  res.send("Hello World");
});



export default router;
