import nodemailer from "nodemailer"
import dotenv from "dotenv"
import User from "../models/user.js"

dotenv.config()

export const sendApiKeyEmail = async (userId, apiKey) => {
  try {
    const user = await User.findById(userId)
    if (!user || !user.email) {
      throw new Error("User email not found")
    }

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: "Your Weather API Key",
      text: `
Hello ${user.name},

Thank you for registering with our Weather API service. Your API key has been successfully generated.

Your API Key: ${apiKey}

Important:
1. Keep this key secure and do not share it with others.
2. Use this key to authenticate your requests to our Weather API.
3. If you believe your key has been compromised, please contact our support team immediately.

For documentation on how to use the API, please visit our developer portal.

If you have any questions or need assistance, don't hesitate to reach out to our support team.

Best regards,
The Weather API Team
      `,
      html: `
<h2>Hello ${user.name},</h2>

<p>Thank you for registering with our Weather API service. Your API key has been successfully generated.</p>

<p><strong>Your API Key:</strong> <code>${apiKey}</code></p>

<h3>Important:</h3>
<ol>
  <li>Keep this key secure and do not share it with others.</li>
  <li>Use this key to authenticate your requests to our Weather API.</li>
  <li>If you believe your key has been compromised, please contact our support team immediately.</li>
</ol>

<p>For documentation on how to use the API, please visit our <a href="#">developer portal</a>.</p>

<p>If you have any questions or need assistance, don't hesitate to reach out to our support team.</p>

<p>Best regards,<br>The Weather API Team</p>
      `,
    }

    await transporter.sendMail(mailOptions)
    console.log("API key email sent successfully")
  } catch (error) {
    console.error("Error sending API key email:", error)
    throw error
  }
}

