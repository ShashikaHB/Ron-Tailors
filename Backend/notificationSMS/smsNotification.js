import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);
export const sendSMS = async (messageBody, recipientNumber) => {
  try {
    const message = await client.messages.create({
      body: messageBody,
      from: twilioNumber,
      to: recipientNumber,
    });
    return message.body;
  } catch (error) {
    throw new Error(`Failed to send SMS: ${error.message}`);
  }
};
