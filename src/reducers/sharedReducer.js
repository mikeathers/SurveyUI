import * as actionTypes from "actions/actionTypes";

const sharedReducerDefaultState = {
  showErrorModal: false
};

export default (state = sharedReducerDefaultState, action) => {
  switch (action.type) {
    case actionTypes.SHOW_ERROR_MODAL:
      return {
        ...state,
        showErrorModal: true
      };
    case actionTypes.HIDE_ERROR_MODAL:
      return {
        ...state,
        showErrorModal: false
      };
    default:
      return state;
  }
};
