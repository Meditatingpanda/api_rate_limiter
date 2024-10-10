import axios from "axios";
import { API_URL } from "../constants/API";

const smsApiServices = {
  sendSms: async (phoneNum: string) => {
    const response = await axios.post(`${API_URL}/sms`, { phoneNum });
    return response.data;
  },
  getSmsSent: async (time: number) => {
    const response = await axios.get(`${API_URL}/sms/sent`, {
      params: { time },
    });
    return response.data;
  },
  getRateLimitStatus: async (time: number) => {
    const response = await axios.get(`${API_URL}/sms/rate-limit`, {
      params: { time },
    });
    return response.data;
  },
};

export default smsApiServices;
