import axios from "axios";

// const DEV_URL = "http://localhost:50601/api/";
const DEV_URL = "http://premex.microservices.mi3d.cases.expedia.org/api/";

export const uploadDocumentTemplate = async (
  file,
  templateName,
  fileName,
  update,
  letterTemplateId
) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("templateName", templateName);
  formData.append("fileName", fileName);
  formData.append("update", update);
  formData.append("letterTemplateId", letterTemplateId);
  try {
    const res = await axios({
      method: "POST",
      url: DEV_URL + "template/uploaddocumenttemplate",
      dataType: "json",
      data: formData,
      "Content-Type": "multipart/form-data"
    });
    return res;
  } catch (err) {}
};

export const uploadEmailTemplateImage = async file => {
  const formData = new FormData();
  formData.append("file", file);
  try {
    const res = await axios({
      method: "POST",
      url: DEV_URL + "template/uploademailtemplateimage",
      dataType: "json",
      data: formData,
      "Content-Type": "multipart/form-data"
    });
    return res;
  } catch (err) {}
};

export const getTemplateStrings = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: DEV_URL + "template/gettemplatestrings",
      dataType: "json"
    });
    return res.data;
  } catch (err) {
    return err;
  }
};

export const saveEmailTemplate = async template => {
  try {
    const res = await axios({
      method: "POST",
      url: DEV_URL + "template/saveemailtemplate",
      dataType: "json",
      data: template
    });
    return res;
  } catch (err) {}
};

export const removeEmailTemplate = async emailTemplateId => {
  try {
    const res = await axios({
      method: "POST",
      url: DEV_URL + "template/removeemailtemplate",
      dataType: "json",
      data: { emailTemplateId }
    });
    return res;
  } catch (err) {}
};

export const getEmailTemplates = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: DEV_URL + "template/getemailtemplates",
      dataType: "json"
    });
    return res.data;
  } catch (err) {
    return err;
  }
};

export const getLetterTemplates = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: DEV_URL + "template/getlettertemplates",
      dataType: "json"
    });
    return res.data;
  } catch (err) {
    return err;
  }
};

export const getEmailTemplate = async emailTemplateId => {
  try {
    const res = await axios({
      method: "POST",
      url: DEV_URL + "template/getemailtemplate",
      dataType: "json",
      data: { emailTemplateId }
    });
    return res;
  } catch (err) {}
};

export const removeLetterTemplate = async template => {
  try {
    const res = await axios({
      method: "POST",
      url: DEV_URL + "template/removelettertemplate",
      dataType: "json",
      data: template
    });
    return res;
  } catch (err) {}
};

export const downloadLetterTemplate = async path => {
  try {
    const res = await axios({
      method: "POST",
      url: DEV_URL + "template/downloadlettertemplate",
      dataType: "json",
      data: { path },
      contentType: "application/json; charset=utf-8",
      responseType: "blob"
    });
    return res;
  } catch (err) {}
};
