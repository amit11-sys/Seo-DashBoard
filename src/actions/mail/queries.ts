
import * as nodemailer from "nodemailer";

export const sendMail = async (email: string, subject: string, text: any) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587, // TLS port
      secure: false, // Use false for STARTTLS
      auth: {
        user: process.env.USER,
        pass: process.env.PASSWORD, // App password
      },
    });

    const send = await transporter.sendMail({
      from: `"Track Scop " <${process.env.USER}>`,
      to: email,
      subject: subject,
      html: text,
    });
    // console.log(send);
    
    return {
      success: true,
      message: "Email Sent Successfully",
    };
  } catch (error) {
    console.error("Email not sent:", error);
  }
};
