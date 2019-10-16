import { PRIMARY_ITEM_SELECTED, SECONDARY_ITEM_SELECTED } from "./actionTypes";

export const selectPrimaryItem = item => ({
  type: PRIMARY_ITEM_SELECTED,
  item
});

export const selectSecondaryItem = item => ({
  type: SECONDARY_ITEM_SELECTED,
  item
});
