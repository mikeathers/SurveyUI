import axios from "axios";

import { getCasesEndpoint, env } from "endpoints";

const DEV_URL = getCasesEndpoint(env);

export const saveCompletedSurvey = async completedSurvey => {
  try {
    const res = await axios({
      method: "POST",
      url: DEV_URL + "survey/savecompletedsurvey",
      dataType: "json",
      data: completedSurvey
    });
    return res;
  } catch (err) {
    return err;
  }
};

export const getCompletedSurvey = async completedSurveyRequest => {
  try {
    const res = await axios({
      method: "POST",
      url: DEV_URL + "survey/getcompletedsurvey",
      dataType: "json",
      data: completedSurveyRequest
    });
    return res;
  } catch (err) {
    return err;
  }
};
