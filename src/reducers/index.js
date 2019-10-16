import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";

import authReducer from "./authReducer";
import menuReducer from "./menuReducer";
import caseReducer from "./caseReducer";
import sharedReducer from "./sharedReducer";
import stopCaseReasonsReducer from "./stopCaseReasonsReducer";

export default combineReducers({
  auth: authReducer,
  menus: menuReducer,
  case: caseReducer,
  shared: sharedReducer,
  stopCaseReasons: stopCaseReasonsReducer,
  routing: routerReducer
});
