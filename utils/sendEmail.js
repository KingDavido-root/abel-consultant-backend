// backend/utils/sendEmail.js
const nodemailer = require('nodemailer');

async function sendEmail(to, subject, text) {
  try {
    const transporter = nodemailer.createTransport({
      // Replace with your actual mail config
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text
    });

    console.log('✅ Email sent to:', to);
  } catch (err) {
    console.error('❌ Failed to send email:', err);
  }
}

module.exports = sendEmail;
