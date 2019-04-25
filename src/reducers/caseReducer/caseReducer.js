import * as actionTypes from "actions/actionTypes";

const defaultState = {
  selectedCase: {},
  mi3dCaseId: null,
  mi3dCase: {}
};

const selectedCase = (state = defaultState, action) => {
  switch (action.type) {
    case actionTypes.SELECT_BLUEDOG_CASE:
      return {
        ...state,
        selectedCase: action.selectedCase
      };
    case actionTypes.UPDATE_BLUEDOG_CASE:
      return {
        ...state,
        selectedCase: action.updatedCase
      };
    case actionTypes.UPDATE_MI3D_CASE_ID:
      return {
        ...state,
        mi3dCaseId: action.caseId
      };
    case actionTypes.UPDATE_MI3D_CASE:
      return {
        ...state,
        mi3dCase: action.selectedCase
      };
    default:
      return state;
  }
};

export default selectedCase;
