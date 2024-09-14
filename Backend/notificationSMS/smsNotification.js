import axios from "axios";

const authToken = process.env.SMS_API_AUTH_TOKEN;
const callerId = process.env.SMS_API_PHONE_NUMBER;

export const sendSMS = async (messageBody, recipientNumber) => {
  const transformedNumber = recipientNumber.replace(/^0/, "+94");
  try {
    const response = await axios({
      method: "post",
      url: "https://dashboard.smsapi.lk/api/v3/sms/send",
      headers: { 
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json', // Explicitly set the Content-Type header if needed
      },
      data: {
        recipient: transformedNumber,
        sender_id: `${callerId}`,
        type: "plain",
        message: messageBody,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to send SMS: ${error.message}`);
  }
};
