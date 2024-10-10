import { API_URL } from '@/constants/API'
import axios from 'axios'

const smsApiServices = {
  sendSms: async (phoneNum: string) => {
    const response = await axios.post(`${API_URL}/sms/send`, { phoneNum })
    return response.data
  },
  getSmsSent: async (time: number) => {
    const response = await axios.get(`${API_URL}/sms/total-sms-sent`, {
      params: { time },
    })
    return response.data
  },
  getRateLimitStatus: async (time: number) => {
    const response = await axios.get(`${API_URL}/sms/rate-limit-status`, {
      params: { time },
    })
    return response.data
  },
  getAllSms: async () => {
    const response = await axios.get(`${API_URL}/sms/get-all-sms`)
    return response.data
  },
}

export default smsApiServices
