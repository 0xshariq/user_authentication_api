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
      secure: process.env.EMAIL_PORT === "465", // Use secure if port is 465
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"API Support Team" <${process.env.EMAIL_FROM}>`,
      to: user.email,
      subject: "🔑 Your API Key is Ready!",
      text: `
Hello ${user.name},

Welcome to our platform! Your API key has been successfully generated and is now ready for use.

🔹 Your API Key: ${apiKey}

🚀 **How to Use Your API Key**
- This key is your unique identifier for accessing our APIs.
- Keep it secure and do NOT share it with anyone.
- Use this key in the "Authorization" header when making API requests.

🔒 **Security Tips**
- Store this key securely and avoid sharing it.
- If you suspect any unauthorized usage, regenerate your key immediately from your dashboard.
- Check our API documentation for best practices: https://api-docs-gilt.vercel.app/

Need help? Reach out to our support team at [Insert Support Email].

Best regards,  
The API Team
      `,
      html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; color: #333;">
        <h2 style="color: #007bff;">Hello ${user.name},</h2>
        <p>Welcome to our platform! Your API key has been successfully generated and is now ready for use.</p>
        
        <h3 style="color: #28a745;">🔑 Your API Key:</h3>
        <pre style="background-color: #f4f4f4; padding: 10px; border-radius: 5px; font-size: 16px;">${apiKey}</pre>

        <h3>🚀 How to Use Your API Key</h3>
        <ul>
          <li>This key is your unique identifier for accessing our APIs.</li>
          <li>Keep it secure and do <strong>NOT</strong> share it with anyone.</li>
          <li>Use this key in the <code>Authorization</code> header when making API requests.</li>
        </ul>

        <h3 style="color: #dc3545;">🔒 Security Tips</h3>
        <ul>
          <li>Store this key securely and avoid sharing it.</li>
          <li>If you suspect any unauthorized usage, regenerate your key immediately from your dashboard.</li>
          <li>Check our <a href="https://api-docs-gilt.vercel.app/" target="_blank">API documentation</a> for best practices.</li>
        </ul>

        <p>If you need any assistance, reach out to our support team at <a href="mailto:[Insert Support Email]">[Insert Support Email]</a>.</p>

        <p>Best regards,<br><strong>The API Team</strong></p>
      </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ API key email sent successfully to:", user.email);
  } catch (error) {
    console.error("❌ Error sending API key email:", error.message);
    throw error;
  }
};
