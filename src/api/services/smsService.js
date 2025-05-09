import axios from "axios";

const smsService = {
    primarySms: async (mobileno, otp) => {
        try {
            const response = await axios.get(`https://sms.timesapi.in/api/v1/send?username=kauverytrans.trans&password=rvR6h&unicode=false&from=KAUVRY&to=${mobileno}&text=${otp}&corelationid=''&dltContentId=8393739`)
            console.log(response.data)
            return response.data
        } catch (error) {
            throw error
        }
    },
    secondarySms: async (mobileno, otp) => {
        try {
            const response = await axios.post(`https://sms.cell24x7.in/otpReceiver/sendSMS?user=kauvery_hosp&pwd=apikauvery&sender=KAUVRY&mobile=${mobileno}&msg=${otp}%20is%20your%20Doctor%20App%20OTP%20for%20verifying%20the%20registered%20mobile%20number.%20Regards,%20Kauvery%20Hospital.&mt=0`)
            return response.data
        } catch (error) {
            throw error
        }
    }
}

export default smsService;