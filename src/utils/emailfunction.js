const nodemailer = require("nodemailer");

const dotenv = require("dotenv");

dotenv.config();

const emailUser =
  process.env.EMAIL_USER;

const emailPass =
  process.env.EMAIL_PASS;

const emailConfig = {
  service: "gmail",

  auth: {
    user: emailUser,
    pass: emailPass,
  },
};

async function sendEmailOTP(
  mail,
  otp
) {
  try {
    const transporter =
      nodemailer.createTransport(
        emailConfig
      );

    await transporter.sendMail({
      from: process.env.EMAIL_USER,

      to: mail,

      subject: "Verify your email",

      text: `Your OTP code is: ${otp}`,
    });

    console.log(
      "Email sent successfully"
    );

    return true;
  } catch (error) {
    console.error(
      "Error sending email:",
      error
    );

    return false;
  }
}

module.exports = sendEmailOTP;