import * as actionTypes from "actions/actionTypes";

const defaultState = {
  user: {},
  isAuthenticated: false
};

const auth = (state = defaultState, action) => {
  switch (action.type) {
    case actionTypes.LOGIN_USER:
      return {
        ...state,
        user: action.user,
        isAuthenticated: action.user.isAuthenticated
      };
    case actionTypes.LOGOUT_USER:
      return {
        user: {},
        isAuthenticated: false
      };
    case actionTypes.SAVE_USER_DETAILS:
      return {
        ...state,
        user: action.userDetails,
        isAuthenticated: true
      };
    default:
      return state;
  }
};

export default auth;
