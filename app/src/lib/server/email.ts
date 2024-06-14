import { env } from "$env/dynamic/private";

import nodemailer from "nodemailer";

// NOTE: 
// It might seem like I'm doing unsecure things but 
// setting `secure: true` would create an internal error
// and disallow sending emails from the client. In addition to that,
// `rejectUnauthorized: false`, is also needed because of this

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: env.GOOGLE_SENDER_EMAIL,
    pass: env.GOOGLE_SENDER_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  }
});

transporter.verify((error, success) => {
  if (error) {
    console.error(error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

export default transporter;
