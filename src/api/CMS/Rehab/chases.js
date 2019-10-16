import axios from "axios";
import { getCasesEndpoint, env } from "endpoints";

const DEV_URL = getCasesEndpoint("local");

export const createFirstChase = async chase => {
  try {
    const res = await axios({
      withCredentials: true,
      method: "POST",
      url: DEV_URL + "chase/create-first-chase",
      dataType: "json",
      data: chase
    });
    return res;
  } catch (err) {
    return err.response;
  }
};

export const completeChase = async chase => {
  try {
    const res = await axios({
      withCredentials: true,
      method: "PUT",
      url: DEV_URL + "chase/complete-chase",
      dataType: "json",
      data: chase
    });
    return res;
  } catch (err) {
    return err.response;
  }
};

export const extendChase = async chase => {
  try {
    const res = await axios({
      withCredentials: true,
      method: "PUT",
      url: DEV_URL + "chase/extend-chase",
      dataType: "json",
      data: chase
    });
    return res;
  } catch (err) {
    return err.response;
  }
};

export const getChases = async () => {
  try {
    const res = await axios({
      withCredentials: true,
      method: "GET",
      url: DEV_URL + "chase/get-chases",
      dataType: "json"
    });
    return res;
  } catch (err) {
    return err.response;
  }
};
