import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";

import authReducer from "./authReducer/authReducer";
import menuReducer from "./menuReducer/menuReducer";
import caseReducer from "./caseReducer/caseReducer";
import sharedReducer from "./sharedReducer/sharedReducer";

export default combineReducers({
  auth: authReducer,
  menus: menuReducer,
  case: caseReducer,
  shared: sharedReducer,
  routing: routerReducer
});
