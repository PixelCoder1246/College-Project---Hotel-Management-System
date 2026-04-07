const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

/**
 * Send OTP email to user.
 * If DEV_SKIP_EMAIL=true, logs the OTP to the console instead.
 */
const sendOtpEmail = async (to, otp, name) => {
  if (process.env.DEV_SKIP_EMAIL === 'true') {
    console.log(`\n📧 [DEV EMAIL — NOT SENT]`);
    console.log(`   To:   ${to}`);
    console.log(`   OTP:  ${otp}`);
    console.log(
      `   Note: Set DEV_SKIP_EMAIL=false and configure SMTP to send real emails.\n`
    );
    return;
  }

  const transporter = createTransporter();

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your OTP Code</title>
      <style>
        body { font-family: 'Segoe UI', sans-serif; background: #0a0e1a; margin: 0; padding: 0; }
        .container { max-width: 520px; margin: 40px auto; background: #1a2236; border-radius: 16px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #1a2236, #0d1b2a); padding: 40px 40px 20px; text-align: center; border-bottom: 1px solid rgba(201,168,76,0.3); }
        .logo { font-size: 24px; font-weight: 700; color: #c9a84c; letter-spacing: 2px; }
        .tagline { color: #8892a4; font-size: 13px; margin-top: 6px; }
        .body { padding: 40px; }
        .greeting { color: #ffffff; font-size: 18px; font-weight: 600; margin-bottom: 16px; }
        .text { color: #8892a4; font-size: 14px; line-height: 1.6; margin-bottom: 32px; }
        .otp-box { background: rgba(201,168,76,0.1); border: 2px solid rgba(201,168,76,0.4); border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 32px; }
        .otp-label { color: #8892a4; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 12px; }
        .otp-code { font-size: 42px; font-weight: 700; letter-spacing: 12px; color: #c9a84c; font-family: 'Courier New', monospace; }
        .expiry { color: #8892a4; font-size: 12px; margin-top: 12px; }
        .footer { background: #0d1b2a; padding: 20px 40px; text-align: center; }
        .footer-text { color: #4a5568; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">⚜ HOTEL MS</div>
          <div class="tagline">Hotel Management System</div>
        </div>
        <div class="body">
          <div class="greeting">Hello, ${name}!</div>
          <div class="text">
            You requested to log in to your Hotel Management System account.
            Use the OTP below to complete your login. This code is valid for <strong style="color:#c9a84c">10 minutes</strong>.
          </div>
          <div class="otp-box">
            <div class="otp-label">Your One-Time Password</div>
            <div class="otp-code">${otp}</div>
            <div class="expiry">⏱ Expires in 10 minutes</div>
          </div>
          <div class="text" style="margin-bottom:0;">
            If you didn't request this, please ignore this email. Your account remains secure.
          </div>
        </div>
        <div class="footer">
          <div class="footer-text">© ${new Date().getFullYear()} Hotel Management System. All rights reserved.</div>
        </div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"Hotel Management System" <${process.env.SMTP_FROM}>`,
    to,
    subject: `${otp} is your Hotel MS login OTP`,
    html,
  });
};

module.exports = { sendOtpEmail };
