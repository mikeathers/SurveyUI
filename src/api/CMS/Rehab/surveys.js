import axios from "axios";

// const DEV_URL = "http://localhost:50601/api/";
const DEV_URL = "http://premex.microservices.mi3d.cases.expedia.org/api/";

export const saveCompletedSurvey = async completedSurvey => {
  try {
    const res = await axios({
      method: "POST",
      url: DEV_URL + "survey/savecompletedsurvey",
      dataType: "json",
      data: completedSurvey
    });
    return res.data;
  } catch (err) {
    return err;
  }
};

export const getCompletedSurvey = async completedSurveyId => {
  try {
    const res = await axios({
      method: "POST",
      url: DEV_URL + "survey/getcompletedsurvey",
      dataType: "json",
      data: { completedSurveyId }
    });
    return res.data;
  } catch (err) {
    return err;
  }
};
