// backend/utils/sendEmail.js
const nodemailer = require('nodemailer');

async function sendEmail({ to, subject, text, html }) {
  try {
    // Check if email configuration is available
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('⚠️  Email not configured, skipping email send');
      return;
    }

    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text
    };

    // Add HTML content if provided
    if (html) {
      mailOptions.html = html;
    }

    await transporter.sendMail(mailOptions);
    console.log('✅ Email sent to:', to);
  } catch (err) {
    console.error('❌ Failed to send email:', err.message);
  }
}

module.exports = sendEmail;
