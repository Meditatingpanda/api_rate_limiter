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
    return res
      .status(400)
      .json({ error: "Bad Request: Missing phone number or IP address" });
  }

  try {
    // log the request
    logger(req.method, ipAddress, phoneNum);

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
          minuteCount: 0,
          dailyCount: 0,
          lastMinuteReset: new Date(),
          lastDailyReset: new Date(),
        },
      });
    }

    const now = new Date();

    // Reset counters if necessary
    if (rateLimit.lastMinuteReset < new Date(now.getTime() - 60000)) {
      rateLimit.minuteCount = 0;
      rateLimit.lastMinuteReset = now;
    }

    if (rateLimit.lastDailyReset < new Date(now.getTime() - 86400000)) {
      rateLimit.dailyCount = 0;
      rateLimit.lastDailyReset = now;
    }

    // Check for rate limit violations
    if (rateLimit.minuteCount >= minuteLimit) {
      await createViolation(phoneNum, ipAddress, "MINUTE");
      logger(req.method, ipAddress, phoneNum, "Violation", "MINUTE");
      return sendRateLimitResponse(
        res,
        60,
        minuteLimit,
        minuteLimit - rateLimit.minuteCount
      );
    }

    if (rateLimit.dailyCount >= dailyLimit) {
      await createViolation(phoneNum, ipAddress, "DAILY");
      logger(req.method, ipAddress, phoneNum, "Violation", "DAILY");
      return sendRateLimitResponse(
        res,
        86400,
        dailyLimit,
        dailyLimit - rateLimit.dailyCount
      );
    }

    // Increment counters
    rateLimit.minuteCount++;
    rateLimit.dailyCount++;

    // Update the rate limit record
    await prisma.rateLimit.update({
      where: { id: rateLimit.id },
      data: rateLimit,
    });

    next();
  } catch (error) {
    console.error("Rate limiter error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Helper functions
async function createViolation(
  phoneNumber: string,
  ipAddress: string,
  violationType: "MINUTE" | "DAILY"
) {
  await prisma.rateViolation.create({
    data: { phoneNumber, ipAddress, violationType },
  });
}

function sendRateLimitResponse(
  res: Response,
  retryAfter: number,
  limit: number,
  remaining: number
) {
  res.setHeader("Retry-After", retryAfter.toString());
  res.setHeader("X-RateLimit-Limit", limit.toString());
  res.setHeader("X-RateLimit-Remaining", remaining.toString());
  return res.status(429).json({ error: "Too Many Requests" });
}

const logger = (
  method: string,
  ip: string,
  phoneNum: string,
  message?: string,
  violationType?: string
) => {
  const logParts = [
    `${method} -->`,
    ip,
    phoneNum,
    violationType || '',
    message || '',
    new Date().toISOString()
  ];
  console.log(logParts.filter(Boolean).join(' '));
};
