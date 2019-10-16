import axios from "axios";
import { getCasesEndpoint, getDocumentBuilderEndpoint, env } from "endpoints";

const DOC_URL = getDocumentBuilderEndpoint(env);
const DEV_URL = getCasesEndpoint(env);

export const createLetterDocument = async letter => {
  try {
    const res = await axios({
      method: "POST",
      url: DOC_URL + "document/create-document",
      dataType: "json",
      data: letter
    });

    return res;
  } catch (err) {
    return err.response;
  }
};

export const createEmailDocument = async emailDocument => {
  try {
    const res = await axios({
      method: "POST",
      url: DOC_URL + "document/create-email-document",
      dataType: "json",
      data: emailDocument
    });

    return res;
  } catch (err) {
    return err.response;
  }
};

export const createInitialSurveyDocument = async survey => {
  try {
    const res = await axios({
      method: "POST",
      url: DOC_URL + "document/create-initial-survey-document",
      dataType: "json",
      data: survey
    });
    return res;
  } catch (err) {
    return err.response;
  }
};

export const createClinicianSurveyDocument = async survey => {
  try {
    const res = await axios({
      method: "POST",
      url: DOC_URL + "document/create-clinician-survey-document",
      dataType: "json",
      data: survey
    });
    return res;
  } catch (err) {
    return err.response;
  }
};

export const createSOAPSurveyDocument = async survey => {
  try {
    const res = await axios({
      method: "POST",
      url: DOC_URL + "document/create-soap-survey-document",
      dataType: "json",
      data: survey
    });
    return res;
  } catch (err) {
    return err.response;
  }
};

export const createDischargeSurveyDocument = async survey => {
  try {
    const res = await axios({
      method: "POST",
      url: DOC_URL + "document/create-discharge-survey-document",
      dataType: "json",
      data: survey
    });
    return res;
  } catch (err) {
    return err.response;
  }
};

export const addDocumentToCase = async document => {
  try {
    const res = await axios({
      withCredentials: true,
      method: "POST",
      url: DEV_URL + "case/add-case-document",
      dataType: "json",
      data: document
    });
    return res;
  } catch (err) {
    return err.response;
  }
};

export const updateDocumentOnCase = async document => {
  try {
    const res = await axios({
      withCredentials: true,
      method: "PUT",
      url: DEV_URL + "case/update-case-document",
      dataType: "json",
      data: document
    });
    return res;
  } catch (err) {
    return err.response;
  }
};

export const downloadDocument = async path => {
  try {
    const res = await axios({
      withCredentials: true,
      method: "POST",
      url: DEV_URL + "case/download-case-document",
      dataType: "json",
      data: { path },
      contentType: "application/json; charset=utf-8",
      responseType: "blob"
    });
    return res;
  } catch (err) {
    return err.response;
  }
};
