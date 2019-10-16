import axios from "axios";
import { getCasesEndpoint, env } from "endpoints";

const DEV_URL = getCasesEndpoint(env);

export const getStopCaseReasons = async () => {
  try {
    const res = await axios({
      withCredentials: true,
      method: "GET",
      url: DEV_URL + "case/get-stop-case-reasons",
      dataType: "json"
    });
    return res;
  } catch (err) {
    return err.response;
  }
};

export const saveStopCaseReason = async reason => {
  try {
    const res = await axios({
      withCredentials: true,
      method: "POST",
      url: DEV_URL + "case/save-stop-case-reason",
      dataType: "json",
      data: reason
    });
    return res;
  } catch (err) {
    return err.response;
  }
};

export const removeStopCaseReason = async removeStopCaseReason => {
  try {
    const res = await axios({
      withCredentials: true,
      method: "DELETE",
      url: DEV_URL + "case/remove-stop-case-reason",
      dataType: "json",
      data: removeStopCaseReason
    });
    return res;
  } catch (err) {
    return err.response;
  }
};
