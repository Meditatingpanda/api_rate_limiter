import { Request, Response, NextFunction } from "express";
import { prisma } from "../constants/prismaConfig";

export const rateLimiter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { phoneNum } = req.body;
  const ipAddress = req.ip;
  const minuteLimit = parseInt(process.env.MINUTE_LIMIT || "3");
  const dailyLimit = parseInt(process.env.DAILY_LIMIT || "10");

  if (!phoneNum || !ipAddress) {
    return res.status(400).send("Bad Request");
  }

  let rateLimit = await prisma.rateLimit.findUnique({
    where: {
      phoneNumber_ipAddress: {
        phoneNumber: phoneNum,
        ipAddress: ipAddress as string,
      },
    },
  });

  if (!rateLimit) {
    rateLimit = await prisma.rateLimit.create({
      data: {
        phoneNumber: phoneNum,
        ipAddress: ipAddress as string,
      },
    });
  }
  // checks minutes.day violations, and throw error with appropriate headers

  if (rateLimit.minuteCount >= minuteLimit) {
    res.setHeader("Retry-After", "60");
    res.setHeader("X-RateLimit-Limit", minuteLimit);
    res.setHeader("X-RateLimit-Remaining", minuteLimit - rateLimit.minuteCount);
    await prisma.rateViolation.create({
      data: {
        phoneNumber: phoneNum,
        ipAddress: ipAddress as string,
        violationType: "MINUTE",
      },
    });
    return res.status(429).send("Too Many Requests");
  }

  if (rateLimit.dailyCount >= dailyLimit) {
    res.setHeader("Retry-After", "86400");
    res.setHeader("X-RateLimit-Limit", dailyLimit);
    res.setHeader("X-RateLimit-Remaining", dailyLimit - rateLimit.dailyCount);
    await prisma.rateViolation.create({
      data: {
        phoneNumber: phoneNum,
        ipAddress: ipAddress as string,
        violationType: "DAILY",
      },
    });
    return res.status(429).send("Too Many Requests");
  }

  if (rateLimit.lastMinuteReset < new Date(Date.now() - 60000)) {
    rateLimit.minuteCount = 0;
    rateLimit.lastMinuteReset = new Date();
  }

  if (rateLimit.lastDailyReset < new Date(Date.now() - 86400000)) {
    rateLimit.dailyCount = 0;
    rateLimit.lastDailyReset = new Date();
  }

  rateLimit.minuteCount++;
  rateLimit.dailyCount++;

  await prisma.rateLimit.update({
    where: {
      id: rateLimit.id,
    },
    data: rateLimit,
  });

  next();
};
