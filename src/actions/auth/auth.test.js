import * as actionTypes from "../actionTypes";
import { loginUser, logoutUser } from "./auth";

describe("loginUser", () => {
  it("should have the correct action type", () => {
    const action = loginUser();
    expect(action.type).toEqual(actionTypes.LOGIN_USER);
  });
  it("should have the correct payload", () => {
    const user = { id: 0, name: "test" };
    const action = loginUser(user);
    expect(action.user).toEqual(user);
  });
});

describe("logoutUser", () => {
  const action = logoutUser();
  it("should have the correct action type", () => {
    expect(action.type).toEqual(actionTypes.LOGOUT_USER);
  });
  it("should have the correct payload", () => {
    expect(action.user).toBeUndefined();
  });
});
