import nodemailer from "nodemailer";
import config from "../config";

const { SERVICE, ADDRESS, USERNAME, PASSWORD } = config.nodemailer;

export const transporter = nodemailer.createTransport({
  service: SERVICE, // 사용할 이메일 서비스 (Gmail, Outlook, etc.)
  auth: {
    user: USERNAME, // 보내는 이메일 계정
    pass: PASSWORD, // 이메일 계정의 비밀번호
  },
});

export const sendPasswordResetEmail = async (
  email: string,
  newPassword: string
) => {
  const mailOptions = {
    from: ADDRESS,
    to: email,
    subject: "임시 비밀번호 보내드립니다.",
    text: `임시 비밀번호: ${newPassword}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};
