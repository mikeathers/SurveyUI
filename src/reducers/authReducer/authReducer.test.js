import authReducer from "./authReducer";
import * as actionTypes from "actions";

it("should handle action of type LOGIN_USER", () => {
  const user = {
    id: 0,
    name: "test",
    isAuthenticated: true
  };
  const action = {
    type: actionTypes.LOGIN_USER,
    user
  };
  const newState = authReducer(undefined, action);
  expect(newState).toEqual({ user, isAuthenticated: user.isAuthenticated });
});

it("should handle action of type LOGOUT_USER", () => {
  const action = {
    type: actionTypes.LOGOUT_USER
  };
  const newState = authReducer(undefined, action);
  expect(newState).toEqual({ user: {}, isAuthenticated: false });
});

it("should handle action of unknown type", () => {
  const newState = authReducer(undefined, { type: "" });
  expect(newState).toEqual({ user: {}, isAuthenticated: false });
});
