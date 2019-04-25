import * as actiontypes from "../actionTypes";

export const selectBluedogCase = selectedCase => ({
  type: actiontypes.SELECT_BLUEDOG_CASE,
  selectedCase
});

export const updateBluedogCase = updatedCase => ({
  type: actiontypes.UPDATE_BLUEDOG_CASE,
  updatedCase
});

export const updateMi3dCaseId = caseId => ({
  type: actiontypes.UPDATE_MI3D_CASE_ID,
  caseId
});

export const updateMi3dCase = selectedCase => ({
  type: actiontypes.UPDATE_MI3D_CASE,
  selectedCase
});
