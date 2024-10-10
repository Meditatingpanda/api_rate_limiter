import { Request, Response } from "express";
import { prisma } from "../constants/prismaConfig";

export const smsController = {
  sendSms: async (req: Request, res: Response): Promise<any> => {
    const { phoneNum } = req.body;

    if (!phoneNum) {
      return res
        .status(400)
        .json({ message: "Bad Request: Missing phone number" });
    }

    try {
      const sms = await prisma.sms.create({
        data: {
          phoneNumber: phoneNum,
          message: "Hello World",
        },
      });
      res.status(200).json({ message: "Sms sent", sms });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  // number of sms sent in last min, daily
  // 1 day in seconds = 86400
  // 1 min in seconds = 60
  getSmsSent: async (req: Request, res: Response): Promise<any> => {
    const { time } = req.query;
    // time is in seconds, we have to get the number of sms sent in last parsedTime seconds
    const parsedTime = parseInt(time as string);
    if (isNaN(parsedTime) || parsedTime <= 0) {
      return res.status(400).json({ message: "Invalid time parameter" });
    }
    const currentTime = new Date();
    const timeAgo = new Date(currentTime.getTime() - parsedTime * 1000);

    try {
      const sms = await prisma.sms.findMany({
        where: {
          createdAt: {
            gte: timeAgo,
          },
        },
      });
      res.status(200).json({ sms, timeRange: `${parsedTime} seconds` });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  getRateLimitStatus: async (req: Request, res: Response): Promise<any> => {
    const { time } = req.query;
    // time is in seconds, we have to get the number of sms sent in last parsedTime seconds
    const parsedTime = parseInt(time as string);
    if (isNaN(parsedTime) || parsedTime <= 0) {
      return res.status(400).json({ message: "Invalid time parameter" });
    }
    const currentTime = new Date();
    const timeAgo = new Date(currentTime.getTime() - parsedTime * 1000);

    try {
      const rateLimitViolations = await prisma.rateViolation.findMany({
        where: {
          createdAt: {
            gte: timeAgo,
          },
        },
      });
      res.status(200).json({
        rateLimitViolations,
        timeRange: `${parsedTime} seconds`,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  getAllSms: async (req: Request, res: Response): Promise<any> => {
    try {
      const sms = await prisma.sms.findMany();
      res.status(200).json({ sms });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};
