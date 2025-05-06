import axios from "axios";

const smsService ={
    primarySms:async(mobileNumber,text)=>{
        try {
            const response =await axios.post(`https://sms.timesapi.in/api/v1/send?username={username}&password={password}&unicode={true/false}&from={from}&to=${mobileno}&text=${text}&corelationid={corelationid}&dltContentId={dltContentId}`)
        return response.data
        } catch (error) {
        throw error
        }
    },
secondarySms:async(mobileno)=>{
    try {
        const response = await axios.post(`https://sms.cell24x7.in/otpReceiver/sendSMS?user=kauvery_hosp&pwd=apikauvery&sender=KAUVRY&mobile=${mobileno}&msg=1234%20is%20your%20Kauvery%20Kare%20OTP%20for%20verifying%20the%20registered%20mobile%20number.%20Regards,%20Kauvery%20Hospital.&mt=0`)
        return response.data
    } catch (error) {
        throw error
    }
}
}

export default smsService