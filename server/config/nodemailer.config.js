import { createTransport } from "nodemailer";
import { config } from "dotenv";
config();

const transporter = createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: String(process.env.EMAIL_SENDER),
    pass: String(process.env.EMAIL_SENDER_PASSWORD),
  },
});

export default transporter;