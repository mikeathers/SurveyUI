import * as actionTypes from "actions/actionTypes";

const menuReducerDefaultState = {
  selectedPrimaryItem: "Rehab",
  selectedSecondaryItem: "Dashboard"
};

export default (state = menuReducerDefaultState, action) => {
  switch (action.type) {
    case actionTypes.PRIMARY_ITEM_SELECTED:
      return {
        ...state,
        selectedPrimaryItem: action.item
      };
    case actionTypes.SECONDARY_ITEM_SELECTED:
      return {
        ...state,
        selectedSecondaryItem: action.item
      };
    default:
      return state;
  }
};
