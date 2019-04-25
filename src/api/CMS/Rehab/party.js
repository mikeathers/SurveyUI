import axios from "axios";

// const BD_URL = "http://localhost:60864/api/";
const BD_URL = "http://bluedog-repo-microservice-dev/api/";

export const updateInjuredPartyDetails = async details => {
  const res = await axios({
    method: "POST",
    url: BD_URL + "party/updateinjuredparty",
    data: details,
    dataType: "json"
  });
  return res;
};

export const getInjuredPartyDetails = async ref => {
  try {
    const res = await axios({
      method: "POST",
      url: BD_URL + "party/getinjuredparty",
      data: { bluedogCaseRef: ref },
      dataType: "json"
    });
    return res.data;
  } catch (err) {
    return err;
  }
};

export const updateInjuredPartyContactDetails = async contactInfo => {
  try {
    const res = await axios({
      method: "POST",
      url: BD_URL + "party/updateinjuredpartycontact",
      data: contactInfo,
      dataType: "json"
    });
    return res;
  } catch (err) {
    return err;
  }
};

export const removeInjuredPartyContactDetails = async contactInfo => {
  try {
    const res = await axios({
      method: "POST",
      url: BD_URL + "party/removeinjuredpartycontact",
      data: contactInfo,
      dataType: "json"
    });
    return res;
  } catch (err) {
    return err;
  }
};

export const addInjuredPartyContactDetails = async contactInfo => {
  try {
    const res = await axios({
      method: "POST",
      url: BD_URL + "party/addinjuredpartycontact",
      data: contactInfo,
      dataType: "json"
    });
    return res;
  } catch (err) {
    return err;
  }
};
