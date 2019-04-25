import axios from "axios";

const BD_URL = "http://bluedog-repo-microservice-dev/api/";
// const DEV_URL = "http://premex.microservices.mi3d.cases.expedia.org/api/";
// const BD_URL = "http://localhost:60864/api/";
const DEV_URL = "http://localhost:50601/api/";
export const getClinicianCases = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: BD_URL + "case/getcliniciancases",
      dataType: "json"
    });
    return res.data;
  } catch (err) {
    return err;
  }
};

export const getAllCases = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: DEV_URL + "case/getallcases",
      dataType: "json"
    });
    return res;
  } catch (err) {
    return err;
  }
};

export const updateCase = async details => {
  try {
    const res = await axios({
      method: "POST",
      url: DEV_URL + "case/updatecase",
      dataType: "json",
      data: details
    });
    return res;
  } catch (err) {
    return err;
  }
};

export const logUpdateToContactDetailsActivity = async activity => {
  try {
    const res = await axios({
      method: "POST",
      url: DEV_URL + "case/updatecontactdetails",
      data: activity,
      dataType: "json"
    });
    return res;
  } catch (err) {
    return err;
  }
};

export const updateBluedogCaseStatus = async bluedogCaseRef => {
  try {
    const res = await axios({
      method: "POST",
      url: BD_URL + "case/updatecasestatus",
      dataType: "json",
      data: { bluedogCaseRef }
    });
    return res;
  } catch (err) {
    return err;
  }
};

export const openCase = async openedCase => {
  try {
    const res = await axios({
      method: "POST",
      url: DEV_URL + "case/createcase",
      dataType: "json",
      data: openedCase
    });
    return res;
  } catch (err) {
    return err;
  }
};

export const getCase = async caseId => {
  try {
    const res = await axios({
      method: "POST",
      url: DEV_URL + "case/getcase",
      dataType: "json",
      data: { caseId }
    });
    return res;
  } catch (err) {
    return err;
  }
};

export const agreeToDpa = async dpa => {
  try {
    const res = await axios({
      method: "POST",
      url: DEV_URL + "case/acceptdpa",
      dataType: "json",
      data: dpa
    });
    return res;
  } catch (err) {
    return err;
  }
};

export const createCaseNote = async caseNote => {
  try {
    const res = await axios({
      method: "POST",
      url: DEV_URL + "case/createcasenote",
      dataType: "json",
      data: caseNote
    });
    return res;
  } catch (err) {
    return err;
  }
};

export const updateCaseNote = async caseNote => {
  try {
    const res = await axios({
      method: "POST",
      url: DEV_URL + "case/updatecasenote",
      dataType: "json",
      data: caseNote
    });
    return res;
  } catch (err) {
    return err;
  }
};

export const removeCaseNote = async caseNote => {
  try {
    const res = await axios({
      method: "POST",
      url: DEV_URL + "case/removecasenote",
      dataType: "json",
      data: caseNote
    });
    return res;
  } catch (err) {
    return err;
  }
};
