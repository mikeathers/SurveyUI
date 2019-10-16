import axios from "axios";
import { getEmailManagementEndpoint, env } from "endpoints";

const EMAIL_URL = getEmailManagementEndpoint(env);

export const sendEmail = async email => {
  try {
    const res = await axios({
      method: "POST",
      url: EMAIL_URL + "email/send-email",
      dataType: "json",
      data: email
    });
    return res;
  } catch (err) {
    return err.response;
  }
};
