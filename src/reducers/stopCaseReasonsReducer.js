import * as actionTypes from "actions/actionTypes";

const defaultState = {
  reasons: []
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case actionTypes.GET_STOP_CASE_REASONS:
      return {
        ...state,
        reasons: action.stopCaseReasons
      };
    default:
      return state;
  }
};
