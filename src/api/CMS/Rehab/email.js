import axios from "axios";

const DEV_URL = "http://premex.microservices.emailmanagement.expedia.org/api/";

export const sendEmail = async email => {
  try {
    const res = await axios({
      method: "POST",
      url: DEV_URL + "email/sendemail",
      dataType: "json",
      data: email
    });
    return res;
  } catch (err) {}
};
