import React from "react";
import { mount, shallow } from "enzyme";
import Root from "Root";
import {LogoutCallback} from "./LogoutCallback";

const setup = (props = {}, state = null) => {
    const wrapper = mount(
        <Root>
            <LogoutCallback/>
        </Root>
    );
    if (state) wrapper.setState(state);
    return wrapper;
};

describe("LogoutCallback", () => {
    const wrapper = setup();

    it("should render without crashing", () => {
        expect(wrapper.length).toBe(1);
    });

    it("should render loading model", () => {
        expect(wrapper.find("#signoutRedirectCallbackLoadingModal").first().length).toBe(1);
    });
});
