const emailTransporter = require("../config/emailConfig");
const smsClient = require("../config/smsConfig");
const dotenv = require("dotenv");
dotenv.config();

const sendNotification = async (req, res) => {
  const { toEmail, toPhone, subject, message } = req.body;

  let emailSent = false;
  let smsSent = false;

  // Attempt to send email
  try {
    await emailTransporter.sendMail({
      from: process.env.MAILGUN_FROM,
      to: toEmail,
      subject: subject,
      text: message,
    });
    emailSent = true;
  } catch (error) {
    console.error("Email failed:", error.message);
  }

  // Attempt to send SMS
  try {
    await smsClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE,
      to: toPhone,
    });
    smsSent = true;
  } catch (error) {
    console.error("SMS failed:", error.message);
  }

  // Response based on results
  if (emailSent || smsSent) {
    res.status(200).json({
      message: `Notification status - Email: ${
        emailSent ? "sent" : "failed"
      }, SMS: ${smsSent ? "sent" : "failed"}`,
    });
  } else {
    res.status(500).json({
      error: "Both email and SMS notifications failed",
    });
  }
};

module.exports = { sendNotification };
