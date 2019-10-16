import axios from "axios";
import { getCasesEndpoint, env } from "endpoints";

const DEV_URL = getCasesEndpoint(env);

export const logErrors = async errors => {
  try {
    const res = await axios({
      withCredentials: true,
      method: "POST",
      url: DEV_URL + "error/log-errors",
      dataType: "json",
      data: errors
    });
    return res;
  } catch (err) {
    return err.response;
  }
};
