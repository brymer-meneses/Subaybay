import { dev } from "$app/environment"
import { env } from "$env/dynamic/private";

import nodemailer from "nodemailer";

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: !dev,
  auth: {
    user: env.GOOGLE_SENDER_EMAIL,
    pass: env.GOOGLE_SENDER_PASSWORD,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error(error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

export default transporter;
