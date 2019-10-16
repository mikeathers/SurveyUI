import axios from "axios";
import { getCasesEndpoint, getBluedogEndpoint, env } from "endpoints";

const DEV_URL = getCasesEndpoint(env);
let BD_URL = getBluedogEndpoint(env);

export const getClinicianCases = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: BD_URL + "case/get-clinician-cases",
      dataType: "json"
    });
    return res;
  } catch (err) {
    return err.response;
  }
};

export const getAllCases = async () => {
  try {
    const res = await axios({
      withCredentials: true,
      method: "GET",
      url: DEV_URL + "case/get-all-cases",
      dataType: "json"
    });
    return res;
  } catch (err) {
    return err.response;
  }
};

export const updateCase = async details => {
  try {
    const res = await axios({
      withCredentials: true,
      method: "PUT",
      url: DEV_URL + "case/update-case",
      dataType: "json",
      data: details
    });
    return res;
  } catch (err) {
    return err.response;
  }
};

export const logUpdateToContactDetailsActivity = async activity => {
  try {
    const res = await axios({
      withCredentials: true,
      method: "PUT",
      url: DEV_URL + "case/update-contact-details",
      data: activity,
      dataType: "json"
    });
    return res;
  } catch (err) {
    return err.response;
  }
};

export const updateBluedogCaseStatus = async bluedogCaseRef => {
  try {
    const res = await axios({
      method: "PUT",
      url: BD_URL + "case/update-case-status",
      dataType: "json",
      data: { bluedogCaseRef }
    });
    return res;
  } catch (err) {
    return err.response;
  }
};

export const openCase = async openedCase => {
  try {
    const res = await axios({
      withCredentials: true,
      method: "POST",
      url: DEV_URL + "case/create-case",
      dataType: "json",
      data: openedCase
    });
    return res;
  } catch (err) {
    return err.response;
  }
};

export const getCase = async caseId => {
  try {
    const res = await axios({
      withCredentials: true,
      method: "GET",
      url: DEV_URL + `case/get-case/${caseId}`,
      dataType: "json"
    });
    return res;
  } catch (err) {
    return err.response;
  }
};

export const agreeToDpa = async dpa => {
  try {
    const res = await axios({
      withCredentials: true,
      method: "PUT",
      url: DEV_URL + "case/accept-dpa",
      dataType: "json",
      data: dpa
    });
    return res;
  } catch (err) {
    return err.response;
  }
};

export const agreeToDisclosure = async disclosure => {
  try {
    const res = await axios({
      withCredentials: true,
      method: "PUT",
      url: DEV_URL + "case/accept-disclosure",
      dataType: "json",
      data: disclosure
    });
    return res;
  } catch (err) {
    return err.response;
  }
};

export const createCaseNote = async caseNote => {
  try {
    const res = await axios({
      withCredentials: true,
      method: "POST",
      url: DEV_URL + "case/create-case-note",
      dataType: "json",
      data: caseNote
    });
    return res;
  } catch (err) {
    return err.response;
  }
};

export const updateCaseNote = async caseNote => {
  try {
    const res = await axios({
      withCredentials: true,
      method: "PUT",
      url: DEV_URL + "case/update-case-note",
      dataType: "json",
      data: caseNote
    });
    return res;
  } catch (err) {
    return err.response;
  }
};

export const removeCaseNote = async caseNote => {
  try {
    const res = await axios({
      withCredentials: true,
      method: "DELETE",
      url: DEV_URL + "case/remove-case-note",
      dataType: "json",
      data: caseNote
    });
    return res;
  } catch (err) {
    return err.response;
  }
};

export const setCourseDetails = async courseDetails => {
  try {
    const res = await axios({
      withCredentials: true,
      method: "PUT",
      url: DEV_URL + "case/set-course-details",
      dataType: "json",
      data: courseDetails
    });
    return res;
  } catch (err) {
    return err.response;
  }
};

export const setCaseLocked = async caseLockedData => {
  try {
    const res = await axios({
      withCredentials: true,
      method: "PUT",
      url: DEV_URL + "case/lock-case",
      dataType: "json",
      data: caseLockedData
    });
    return res;
  } catch (err) {
    return err.response;
  }
};

export const setCaseUnlocked = async caseLockedData => {
  try {
    const res = await axios({
      withCredentials: true,
      method: "PUT",
      url: DEV_URL + "case/unlock-case",
      dataType: "json",
      data: caseLockedData
    });
    return res;
  } catch (err) {
    return err.response;
  }
};

export const stopCase = async stopCaseInfo => {
  try {
    const res = await axios({
      withCredentials: true,
      method: "PUT",
      url: DEV_URL + "case/stop-case",
      dataType: "json",
      data: stopCaseInfo
    });
    return res;
  } catch (err) {
    return err.response;
  }
};

export const placeCaseOnHold = async holdCaseInfo => {
  try {
    const res = await axios({
      withCredentials: true,
      method: "PUT",
      url: DEV_URL + "case/place-case-on-hold",
      dataType: "json",
      data: holdCaseInfo
    });
    return res;
  } catch (err) {
    return err.response;
  }
};

export const takeCaseOffHold = async holdCaseInfo => {
  try {
    const res = await axios({
      withCredentials: true,
      method: "PUT",
      url: DEV_URL + "case/take-case-off-hold",
      dataType: "json",
      data: holdCaseInfo
    });
    return res;
  } catch (err) {
    return err.response;
  }
};

export const addSystemActivity = async systemActivity => {
  try {
    const res = await axios({
      withCredentials: true,
      method: "POST",
      url: DEV_URL + "case/add-system-activity",
      dataType: "json",
      data: systemActivity
    });
    return res;
  } catch (err) {
    return err.response;
  }
};

export const updateSystemActivity = async systemActivity => {
  try {
    const res = await axios({
      withCredentials: true,
      method: "PUT",
      url: DEV_URL + "case/update-system-activity",
      dataType: "json",
      data: systemActivity
    });
    return res;
  } catch (err) {
    return err.response;
  }
};

export const saveEmail = async savedEmail => {
  try {
    const res = await axios({
      withCredentials: true,
      method: "POST",
      url: DEV_URL + "case/save-email",
      dataType: "json",
      data: savedEmail
    });
    return res;
  } catch (err) {
    return err.response;
  }
};
