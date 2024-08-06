export const verifyEmail = (otp: string) => {
  return `
    
  <div style="font-family: Arial, sans-serif; line-height: 1.6;">
  <h2>Email Verification</h2>
  <p>Thank you for registering with us. Please use the following OTP to verify your email address:</p>
  <h1 style="background-color: #f7f7f7; padding: 10px; border-radius: 5px; text-align: center; font-size: 24px;">${otp}
  </h1>
  <p>This OTP is valid for the next 10 minutes.</p>
  <p>If you did not request this verification, please ignore this email.</p>
  <p>Best regards,<br>VirtuDial</p>
  </div>

    `;
};

export const forgetPasswordEmail = (firstName: string, resetLink: string) => {
  return `

    <!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8">
  <title>Password Reset Request</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f9f9f9;
      margin: 0;
      padding: 0;
    }

    .container {
      background-color: #ffffff;
      margin: 50px auto;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      max-width: 600px;
    }

    .header {
      text-align: center;
      padding-bottom: 20px;
      border-bottom: 1px solid #eaeaea;
    }

    .header h1 {
      font-size: 24px;
      margin: 0;
    }

    .content {
      margin: 20px 0;
      font-size: 16px;
      color: #333333;
    }

    .button {
      display: inline-block;
      margin: 20px 0;
      padding: 10px 20px;
      background-color: #007bff;
      color: #ffffff;
      text-align: center;
      text-decoration: none;
      border-radius: 4px;
      font-size: 16px;
    }

    .footer {
      text-align: center;
      font-size: 14px;
      color: #777777;
      margin-top: 20px;
      border-top: 1px solid #eaeaea;
      padding-top: 20px;
    }

    .footer p {
      margin: 5px 0;
    }
  </style>
</head>

<body>
  <div class="container">
    <div class="header">
      <h1>Password Reset Request</h1>
    </div>
    <div class="content">
      <p>Hi ${firstName},</p>
      <p>We received a request to reset the password for your account.</p>
      <p>To reset your password, please click the button below:</p>
      <a href="${resetLink}" class="button">Reset Password</a>
      <p>This link is valid for the next 10 minutes. If you did not request a password reset, please ignore this email.
        Your account is safe and no changes have been made.</p>
    </div>
    <div class="footer">
      <p>Thank you,</p>
      <p>The VirtuDial Team</p>
    </div>
  </div>
</body>

</html>
    
    `;
};

export const complaintEmail = (userEmail: string, message: string) => {
  return `

  <!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }

    .container {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      padding: 20px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }

    .header {
      background-color: #007BFF;
      color: #ffffff;
      padding: 10px 0;
      text-align: center;
    }

    .content {
      padding: 20px;
    }

    .footer {
      text-align: center;
      padding: 10px;
      font-size: 12px;
      color: #777777;
    }

    .button {
      display: inline-block;
      padding: 10px 20px;
      margin: 20px 0;
      font-size: 16px;
      color: #ffffff;
      background-color: #007BFF;
      text-decoration: none;
      border-radius: 5px;
    }

    .button:hover {
      background-color: #0056b3;
    }
  </style>
</head>

<body>
  <div class="container">
    <div class="header">
      <h1>Complaint Submission</h1>
    </div>
    <div class="content">
      <p>Dear VirtuaDial Agent,</p>
      <p>I would like to raise a complaint regarding the following issue:</p>
      <p>${message}</p>
      <p>Thank you for your attention to this matter. I look forward to your prompt response.</p>
      <p>Sincerely,</p>
      <p>EMAIL: ${userEmail}</p>
    </div>
    <div class="footer">
      <p>&copy; 2024 VirtuaDial. All rights reserved.</p>
    </div>
  </div>
</body>

</html>
  
  `;
};
