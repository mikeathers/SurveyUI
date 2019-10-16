import axios from "axios";

import { getCasesEndpoint, env } from "endpoints";

const DEV_URL = getCasesEndpoint(env);

export const saveCompletedInitialSurvey = async completedSurvey => {
  try {
    const res = await axios({
      withCredentials: true,
      method: "POST",
      url: DEV_URL + "survey/save-completed-initial-survey",
      dataType: "json",
      data: completedSurvey
    });
    return res;
  } catch (err) {
    return err.response;
  }
};

export const saveCompletedClinicianSurvey = async completedSurvey => {
  try {
    const res = await axios({
      withCredentials: true,
      method: "POST",
      url: DEV_URL + "survey/save-completed-clinician-survey",
      dataType: "json",
      data: completedSurvey
    });
    return res;
  } catch (err) {
    return err.response;
  }
};

export const saveCompletedSOAPSurvey = async completedSurvey => {
  try {
    const res = await axios({
      withCredentials: true,
      method: "POST",
      url: DEV_URL + "survey/save-completed-soap-survey",
      dataType: "json",
      data: completedSurvey
    });
    return res;
  } catch (err) {
    return err.response;
  }
};

export const saveCompletedDischargeSurvey = async completedSurvey => {
  try {
    const res = await axios({
      withCredentials: true,
      method: "POST",
      url: DEV_URL + "survey/save-completed-discharge-survey",
      dataType: "json",
      data: completedSurvey
    });
    return res;
  } catch (err) {
    return err.response;
  }
};

export const getCompletedInitialSurvey = async completedSurveyRequest => {
  try {
    const res = await axios({
      withCredentials: true,
      method: "POST",
      url: DEV_URL + "survey/get-completed-initial-survey",
      dataType: "json",
      data: completedSurveyRequest
    });
    return res;
  } catch (err) {
    return err.response;
  }
};

export const getCompletedClinicianSurvey = async completedSurveyRequest => {
  try {
    const res = await axios({
      withCredentials: true,
      method: "POST",
      url: DEV_URL + "survey/get-completed-clinician-survey",
      dataType: "json",
      data: completedSurveyRequest
    });
    return res;
  } catch (err) {
    return err.response;
  }
};

export const getCompletedSOAPSurvey = async completedSurvey => {
  try {
    const res = await axios({
      withCredentials: true,
      method: "POST",
      url: DEV_URL + "survey/get-completed-soap-survey",
      dataType: "json",
      data: completedSurvey
    });
    return res;
  } catch (err) {
    return err.response;
  }
};

export const getCompletedDischargeSurvey = async completedSurvey => {
  try {
    const res = await axios({
      withCredentials: true,
      method: "POST",
      url: DEV_URL + "survey/get-completed-discharge-survey",
      dataType: "json",
      data: completedSurvey
    });
    return res;
  } catch (err) {
    return err.response;
  }
};
