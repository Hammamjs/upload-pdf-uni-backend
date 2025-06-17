import { createTransport } from 'nodemailer';

export const sendEmail = async (options) => {
  const transporter = createTransport({
    service: 'gmail',
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_PASSWORD,
    },
  });

  const optionObject = {
    subject: 'Request to reset password',
    to: options.email,
    from: 'Unversity of Bahri (Computer Science DB)',
    html: `
    <div 
    style="font-family:Arial,sans-serif;text-align:center;"
    >
    <h3>Hi, ${options.name}</h3>

    <p>We recived request to reset your password</p>
    <p>This code is valid for <span style='color: red;'>10 minutes</span></p>
    <p style='font-size:24px;background: #f3f3f3f3;padding: 10px;border-radius: 5px;display:block;'>
    verification code
    </p>
    <p style='font-size:24px;background: #f3f3f3f3;padding: 10px;border-radius: 5px;display:block;'>
    <strong style="margin-top: 5px;margin-bottom: 5px;">${options.resetCode}</strong>
    </p>
    <h4>Don't share this code with public</h4>
    </div>
    `,
  };
  await transporter.sendMail(optionObject);
};
