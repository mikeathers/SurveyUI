import axios from "axios";
import { getCasesEndpoint, env } from "endpoints";

const DEV_URL = getCasesEndpoint("local");

export const createCallBack = async callback => {
  try {
    const res = await axios({
      withCredentials: true,
      method: "POST",
      url: DEV_URL + "callback/create-callback",
      dataType: "json",
      data: callback
    });
    return res;
  } catch (err) {
    return err.response;
  }
};

export const removeCallBack = async callback => {
  try {
    const res = await axios({
      withCredentials: true,
      method: "DELETE",
      url: DEV_URL + "callback/remove-callback",
      dataType: "json",
      data: callback
    });
    return res;
  } catch (err) {
    return err.response;
  }
};

export const rescheduleCallBack = async callback => {
  try {
    const res = await axios({
      withCredentials: true,
      method: "PUT",
      url: DEV_URL + "callback/reschedule-callback",
      dataType: "json",
      data: callback
    });
    return res;
  } catch (err) {
    return err.response;
  }
};

export const completeCallBack = async callback => {
  try {
    const res = await axios({
      withCredentials: true,
      method: "PUT",
      url: DEV_URL + "callback/complete-callback",
      dataType: "json",
      data: callback
    });
    return res;
  } catch (err) {
    return err.response;
  }
};

export const moveInitialCallBack = async callback => {
  try {
    const res = await axios({
      withCredentials: true,
      method: "PUT",
      url: DEV_URL + "callback/move-initial-callback",
      dataType: "json",
      data: callback
    });
    return res;
  } catch (err) {
    return err.response;
  }
};

export const getCallBacks = async () => {
  try {
    const res = await axios({
      withCredentials: true,
      method: "GET",
      url: DEV_URL + "callback/get-callbacks",
      dataType: "json"
    });
    return res;
  } catch (err) {
    return err.response;
  }
};
