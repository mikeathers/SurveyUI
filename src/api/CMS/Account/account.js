import axios from "axios";
import { getCasesEndpoint, env } from "endpoints";

const DEV_URL = getCasesEndpoint(env);

export const getUserDetails = async () => {
  try {
    const res = await axios({
      withCredentials: true,
      method: "GET",
      url: DEV_URL + "account/get-user-details",
      dataType: "json"
    });
    return res;
  } catch (err) {
    return err.response;
  }
};
