import axios from "axios";
import { getCasesEndpoint, env } from "endpoints";

const DEV_URL = getCasesEndpoint(env);

export const logErrors = async errors => {
  try {
    const res = await axios({
      method: "POST",
      url: DEV_URL + "error/logerrors",
      dataType: "json",
      data: errors
    });
    return res;
  } catch (err) {}
};
