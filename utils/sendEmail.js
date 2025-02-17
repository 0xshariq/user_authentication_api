import nodemailer from "nodemailer";
import User from "../models/user.js"; 

export const sendApiKeyEmail = async (userId, apiKey) => {
  try {
    const user = await User.findById(userId);
    if (!user || !user.email) {
      throw new Error("User email not found");
    }

    if (!process.env.EMAIL_HOST || !process.env.EMAIL_PORT || !process.env.EMAIL_USER || !process.env.EMAIL_PASS || !process.env.EMAIL_FROM) {
      throw new Error("Missing required email environment variables");
    }

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT), 
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: "Your API Key for Our Services",
      text: `
Hello ${user.name},

Thank you for registering with our platform. Your API key has been successfully generated and is ready for use.

Your API Key: ${apiKey}

Important Notes:
1. Keep this key secure and do not share it with anyone.
2. Use this key to authenticate your requests to any of our APIs.
3. If you believe your key has been compromised, please contact our support team immediately to regenerate it.
4. This key grants access to all our APIs. Refer to our documentation for specific endpoints and usage guidelines.

For detailed documentation on how to use our APIs, please visit our developer portal: [Insert Developer Portal Link].

If you have any questions or need assistance, feel free to reach out to our support team at [Insert Support Email].

Best regards,
The API Team
      `,
      html: `
<h2>Hello ${user.name},</h2>

<p>Thank you for registering with our platform. Your API key has been successfully generated and is ready for use.</p>

<p><strong>Your API Key:</strong> <code>${apiKey}</code></p>

<h3>Important Notes:</h3>
<ol>
  <li>Keep this key secure and do not share it with anyone.</li>
  <li>Use this key to authenticate your requests to any of our APIs.</li>
  <li>If you believe your key has been compromised, please contact our support team immediately to regenerate it.</li>
  <li>This key grants access to all our APIs. Refer to our documentation for specific endpoints and usage guidelines.</li>
</ol>

<p>For detailed documentation on how to use our APIs, please visit our <a href="#">developer portal</a>.</p>

<p>If you have any questions or need assistance, feel free to reach out to our support team at <a href="mailto:[Insert Support Email]">[Insert Support Email]</a>.</p>

<p>Best regards,<br>The API Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("API key email sent successfully to:", user.email);
  } catch (error) {
    console.error("Error sending API key email:", error.message);
    throw error;
  }
};
