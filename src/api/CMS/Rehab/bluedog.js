import axios from "axios";
import { getBluedogEndpoint, env } from "endpoints";

let BD_URL = getBluedogEndpoint(env);

export const updateInjuredPartyDetails = async details => {
  try {
    const res = await axios({
      method: "PUT",
      url: BD_URL + "party/update-injured-party",
      data: details,
      dataType: "json"
    });
    return res;
  } catch (err) {
    return err.response;
  }
};

export const getInjuredPartyDetails = async bluedogCaseRef => {
  try {
    const res = await axios({
      method: "GET",
      url: BD_URL + `party/get-injured-party?bluedogCaseRef=${bluedogCaseRef}`,
      dataType: "json"
    });
    return res;
  } catch (err) {
    return err.response;
  }
};

export const updateInjuredPartyContactDetails = async contactInfo => {
  try {
    const res = await axios({
      method: "PUT",
      url: BD_URL + "party/update-injured-party-contact",
      data: contactInfo,
      dataType: "json"
    });
    return res;
  } catch (err) {
    return err.response;
  }
};

export const removeInjuredPartyContactDetails = async contactInfo => {
  try {
    const res = await axios({
      method: "DELETE",
      url: BD_URL + "party/remove-injured-party-contact",
      data: contactInfo,
      dataType: "json"
    });
    return res;
  } catch (err) {
    return err.response;
  }
};

export const addInjuredPartyContactDetails = async contactInfo => {
  try {
    const res = await axios({
      method: "POST",
      url: BD_URL + "party/add-injured-party-contact",
      data: contactInfo,
      dataType: "json"
    });
    return res;
  } catch (err) {
    return err.response;
  }
};

export const addDocumentToBluedogCase = async document => {
  try {
    const res = await axios({
      method: "POST",
      url: BD_URL + "case/add-document-to-case",
      dataType: "json",
      data: document
    });
    return res;
  } catch (err) {
    return err.response;
  }
};

export const captureScreeningDate = async captureScreeningDateInfo => {
  try {
    const res = await axios({
      method: "POST",
      url: BD_URL + "case/capture-screening-date",
      dataType: "json",
      data: captureScreeningDateInfo
    });
    return res;
  } catch (err) {
    return err.response;
  }
};

export const closeBluedogCaseNoFee = async bluedogCaseRef => {
  try {
    const res = await axios({
      method: "POST",
      url: BD_URL + `case/close-case-no-fee?bluedogCaseRef=${bluedogCaseRef}`,
      dataType: "json"
    });
    return res;
  } catch (err) {
    return err.response;
  }
};

export const closeBluedogCase25Fee = async bluedogCaseRef => {
  try {
    const res = await axios({
      method: "POST",
      url: BD_URL + `case/close-case-25-fee?bluedogCaseRef=${bluedogCaseRef}`,
      dataType: "json"
    });
    return res;
  } catch (err) {
    return err.response;
  }
};

export const closeBluedogCase150Fee = async bluedogCaseRef => {
  try {
    const res = await axios({
      method: "POST",
      url: BD_URL + `case/close-case-150-fee?bluedogCaseRef=${bluedogCaseRef}`,
      dataType: "json"
    });
    return res;
  } catch (err) {
    return err.response;
  }
};

export const progressBluedogCaseAsF2F = async bluedogCaseRef => {
  try {
    const res = await axios({
      method: "POST",
      url:
        BD_URL + `case/progress-case-as-f2f?bluedogCaseRef=${bluedogCaseRef}`,
      dataType: "json"
    });
    return res;
  } catch (err) {
    return err.response;
  }
};
