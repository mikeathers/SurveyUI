import axios from "axios";

// const DEV_URL = "http://premex.microservices.mi3d.cases.expedia.org/api/";
const DEV_URL = "http://localhost:50601/api/";

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