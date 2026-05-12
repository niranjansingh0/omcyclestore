import nodemailer from 'nodemailer';
import config from '../config/index.js';

const transporter = nodemailer.createTransport({
  host: config.smtp.host,
  port: config.smtp.port,
  secure: false,
  auth: config.smtp.user && config.smtp.pass
    ? {
        user: config.smtp.user,
        pass: config.smtp.pass
      }
    : undefined
});

export const sendEmail = async ({ to, subject, html, text }) => {
  if (!config.smtp.user || !config.smtp.pass) {
    console.warn(`Email skipped for ${to}: SMTP credentials are not configured.`);
    return;
  }

  await transporter.sendMail({
    from: `${config.smtp.fromName} <${config.smtp.fromEmail}>`,
    to,
    subject,
    html,
    text
  });
};
