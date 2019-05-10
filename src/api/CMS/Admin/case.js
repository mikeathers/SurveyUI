import axios from "axios";
import { getCasesEndpoint, env } from "endpoints";

const DEV_URL = getCasesEndpoint(env);

export const getStopCaseReasons = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: DEV_URL + "case/getstopcasereasons",
      dataType: "json"
    });
    return res;
  } catch (err) {}
};

export const saveStopCaseReason = async reason => {
  try {
    const res = await axios({
      method: "POST",
      url: DEV_URL + "case/savestopcasereason",
      dataType: "json",
      data: reason
    });
    return res;
  } catch (err) {}
};

export const removeStopCaseReason = async stopCaseReasonId => {
  try {
    const res = await axios({
      method: "POST",
      url: DEV_URL + "case/removestopcasereason",
      dataType: "json",
      data: { stopCaseReasonId }
    });
    return res;
  } catch (err) {}
};
