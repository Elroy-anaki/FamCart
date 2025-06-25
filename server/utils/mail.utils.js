import transporter from "../config/nodemailer.config.js";

export function sendEmailVerification (user) {
  transporter.sendMail({
    from: String(process.env.EMAIL_SENDER) || "",
    to: user.userEmail,
        subject: "Verfiy Your Email",
        html: `<h1>Hello ${user.userName}</h1>
        <p>Please click the button below to verify your email:</p>
        <a href="http://localhost:8001/auth/email-verification/${user._id}">
        Verify Email
        </a>`,
      })
    
};

export function sendEmailForGotPassword (user) {
  transporter.sendMail({
    from: String(process.env.EMAIL_SENDER) || "",
    to: user.userEmail,
    subject: "Reset Password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f0f8ff; padding: 20px; border-radius: 8px;">
        <h1 style="color: #006400;">Reset Your Password</h1>
        <p style="color: #003366;">Hello ${user.userName},</p>
        <p style="color: #003366;">We received a request to reset your password. Click the button below to set a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="http://localhost:8001/auth/reset-password?userId=${user._id}&forgotPasswordId=${user.forgotPasswordId}"
             style="background-color: #007BFF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">
            Reset Password
          </a>  
        </div>
        <p style="color: #003366; font-size: 14px;">
          If you didn't request this password reset, you can safely ignore this email.
        </p>
        <p style="color: #003366; font-size: 14px;">
          This link will expire in 24 hours.
        </p>
      </div>
    `,
  });
  
};

