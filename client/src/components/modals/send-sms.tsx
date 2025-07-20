// Example: /api/send-sms.ts
import { NextApiRequest, NextApiResponse } from 'next';

import { Twilio } from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID as string;
const authToken = process.env.TWILIO_AUTH_TOKEN as string;
const client = new Twilio(accountSid, authToken);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { number } = req.body;

    console.log("Received request to send SMS to:", number); // Debugging log

    try {
      const message = await client.messages.create({
        body: 'This is a test message from your SOS service.',
        from: process.env.TWILIO_PHONE_NUMBER as string,
        to: number,
      });

      console.log("SMS sent successfully:", message.sid); // Debugging log
      res.status(200).json({ success: true, messageSid: message.sid });
    } catch (error) {
      console.error("Error sending SMS:", error); // Debugging log
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}