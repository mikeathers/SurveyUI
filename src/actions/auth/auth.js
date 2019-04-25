import * as actiontypes from "../actionTypes";

export const loginUser = user => ({
  type: actiontypes.LOGIN_USER,
  user
});

export const logoutUser = () => ({
  type: actiontypes.LOGOUT_USER
});
