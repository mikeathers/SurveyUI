import axios from "axios";
import { getCasesEndpoint, env } from "endpoints";

const DEV_URL = getCasesEndpoint(env);

export const uploadDocumentTemplate = async (
  file,
  templateName,
  fileName,
  actionedBy,
  letterTemplateId
) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("templateName", templateName);
  formData.append("fileName", fileName);
  formData.append("actionedBy", actionedBy);
  formData.append("letterTemplateId", letterTemplateId);
  try {
    const res = await axios({
      withCredentials: true,
      method: "POST",
      url: DEV_URL + "template/upload-document-template",
      dataType: "json",
      data: formData,
      "Content-Type": "multipart/form-data"
    });
    return res;
  } catch (err) {
    return err.response;
  }
};

export const uploadEmailTemplateImage = async file => {
  const formData = new FormData();
  formData.append("file", file);
  try {
    const res = await axios({
      withCredentials: true,
      method: "POST",
      url: DEV_URL + "template/upload-email-template-image",
      dataType: "json",
      data: formData,
      "Content-Type": "multipart/form-data"
    });
    return res;
  } catch (err) {
    return err.response;
  }
};

export const getTemplateStrings = async () => {
  try {
    const res = await axios({
      withCredentials: true,
      method: "GET",
      url: DEV_URL + "template/get-template-strings",
      dataType: "json"
    });
    return res;
  } catch (err) {
    return err.response;
  }
};

export const saveEmailTemplate = async template => {
  try {
    const res = await axios({
      withCredentials: true,
      method: "POST",
      url: DEV_URL + "template/save-email-template",
      dataType: "json",
      data: template
    });
    return res;
  } catch (err) {
    return err.response;
  }
};

export const removeEmailTemplate = async emailTemplateRequest => {
  try {
    const res = await axios({
      withCredentials: true,
      method: "DELETE",
      url: DEV_URL + "template/remove-email-template",
      dataType: "json",
      data: emailTemplateRequest
    });
    return res;
  } catch (err) {
    return err.response;
  }
};

export const getEmailTemplates = async () => {
  try {
    const res = await axios({
      withCredentials: true,
      method: "GET",
      url: DEV_URL + "template/get-email-templates",
      dataType: "json"
    });
    return res;
  } catch (err) {
    return err.response;
  }
};

export const getLetterTemplates = async () => {
  try {
    const res = await axios({
      withCredentials: true,
      method: "GET",
      url: DEV_URL + "template/get-letter-templates",
      dataType: "json"
    });
    return res;
  } catch (err) {
    return err.response;
  }
};

export const getEmailTemplate = async emailTemplateRequest => {
  try {
    const res = await axios({
      withCredentials: true,
      method: "POST",
      url: DEV_URL + "template/get-email-template",
      dataType: "json",
      data: emailTemplateRequest
    });
    return res;
  } catch (err) {
    return err.response;
  }
};

export const removeLetterTemplate = async template => {
  try {
    const res = await axios({
      withCredentials: true,
      method: "DELETE",
      url: DEV_URL + "template/remove-letter-template",
      dataType: "json",
      data: template
    });
    return res;
  } catch (err) {
    return err.response;
  }
};

export const downloadLetterTemplate = async path => {
  try {
    const res = await axios({
      withCredentials: true,
      url: DEV_URL + "template/download-letter-template",
      method: "POST",
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
