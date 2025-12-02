import axios from "axios";
import { Base_URL } from "./constants";

export const sendEmail = async (email, subject, message) => {
  
  const htmlMessage = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; padding: 16px; color:#333;">
      <p>${message}</p>

      <p style="margin-top: 20px;">
        Regards,<br>
        <strong>Team DevLink</strong>
      </p>
    </div>
  `;

  const response = await axios.post(Base_URL + "/send-email", {
    to: email,
    subject: subject,
    message: htmlMessage,
  });

  console.log("Email sent:", response);
};

