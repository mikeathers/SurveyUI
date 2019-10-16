import axios from "axios";
import * as actionTypes from "./actionTypes";
import { getCasesEndpoint, env } from "endpoints";

const DEV_URL = getCasesEndpoint(env);

export const loginUser = user => ({
  type: actionTypes.LOGIN_USER,
  user
});

export const logoutUser = () => ({
  type: actionTypes.LOGOUT_USER
});

export const getUserDetails = () => {
  return dispatch => {
    axios({
      method: "GET",
      dataType: "json",
      withCredentials: true,
      url: DEV_URL + "account/get-user-details"
    }).then(res => dispatch(saveUserDetails(parseUserName(res.data))));
  };
};

export const saveUserDetails = userDetails => ({
  type: actionTypes.SAVE_USER_DETAILS,
  userDetails: {
    name: userDetails
  }
});

const parseUserName = username => {
  if (username !== "") {
    username = username.split("\\").pop();
    username = username.split(".");
    let firstname = username[0];
    let lastname = username[1];

    const parsedFirstName =
      firstname !== undefined && firstname.replace(/^\w/, c => c.toUpperCase());

    const parsedLastName =
      lastname !== undefined && lastname.replace(/^\w/, c => c.toUpperCase());

    return `${parsedFirstName} ${parsedLastName}`;
  }
  return "Unidentified User";
};
