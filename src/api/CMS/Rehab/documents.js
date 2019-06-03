import axios from "axios";
import { getCasesEndpoint, getDocumentBuilderEndpoint, env } from "endpoints";

const DOC_URL = getDocumentBuilderEndpoint(env);
const DEV_URL = getCasesEndpoint(env);

export const createLetterDocument = async letter => {
  try {
    const res = await axios({
      method: "POST",
      url: DOC_URL + "document/createdocument",
      dataType: "json",
      data: letter
    });

    return res;
  } catch (err) {}
};

export const createSurveyDocument = async survey => {
  try {
    const res = await axios({
      method: "POST",
      url: DOC_URL + "document/createsurveydocument",
      dataType: "json",
      data: survey
    });
    return res;
  } catch (err) {}
};

export const addDocumentToCase = async document => {
  try {
    const res = await axios({
      method: "POST",
      url: DEV_URL + "case/addcasedocument",
      dataType: "json",
      data: document
    });
    return res;
  } catch (err) {}
};

export const updateDocumentOnCase = async document => {
  try {
    const res = await axios({
      method: "POST",
      url: DEV_URL + "case/updatecasedocument",
      dataType: "json",
      data: document
    });
    return res;
  } catch (err) {}
};

export const downloadDocument = async path => {
  try {
    const res = await axios({
      method: "POST",
      url: DEV_URL + "case/downloadcasedocument",
      dataType: "json",
      data: { path },
      contentType: "application/json; charset=utf-8",
      responseType: "blob"
    });
    return res;
  } catch (err) {}
};
