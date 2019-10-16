import * as actionTypes from "./actionTypes";
import axios from "axios";
import { getCasesEndpoint, env } from "endpoints";

const DEV_URL = getCasesEndpoint(env);

export const getStopCaseReasons = () => {
  return dispatch => {
    axios({
      withCredentials: true,
      method: "GET",
      url: DEV_URL + "case/get-stop-case-reasons",
      dataType: "json"
    }).then(res => dispatch(saveStopCaseReasons(res.data)));
  };
};

export const saveStopCaseReasons = stopCaseReasons => ({
  type: actionTypes.GET_STOP_CASE_REASONS,
  stopCaseReasons
});
