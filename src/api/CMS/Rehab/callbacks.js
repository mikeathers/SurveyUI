import axios from "axios";
import { getCasesEndpoint, env } from "endpoints";

const DEV_URL = getCasesEndpoint(env);

export const createCallBack = async callback => {
  try {
    const res = await axios({
      method: "POST",
      url: DEV_URL + "callback/createcallback",
      dataType: "json",
      data: callback
    });
    return res;
  } catch (err) {}
};

export const removeCallBack = async callback => {
  try {
    const res = await axios({
      method: "POST",
      url: DEV_URL + "callback/removecallback",
      dataType: "json",
      data: callback
    });
    return res;
  } catch (err) {
    return err;
  }
};

export const rescheduleCallBack = async callback => {
  try {
    const res = await axios({
      method: "POST",
      url: DEV_URL + "callback/reschedulecallback",
      dataType: "json",
      data: callback
    });
    return res;
  } catch (err) {
    return err;
  }
};

export const completeCallBack = async callback => {
  try {
    const res = await axios({
      method: "POST",
      url: DEV_URL + "callback/completecallback",
      dataType: "json",
      data: callback
    });
    return res;
  } catch (err) {
    return err;
  }
};

export const moveInitialCallBack = async callback => {
  try {
    const res = await axios({
      method: "POST",
      url: DEV_URL + "callback/moveInitialcallback",
      dataType: "json",
      data: callback
    });
    return res;
  } catch (err) {
    return err;
  }
};

export const getCallBacks = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: DEV_URL + "callback/getcallbacks",
      dataType: "json"
    });
    return res;
  } catch (err) {
    return err;
  }
};
