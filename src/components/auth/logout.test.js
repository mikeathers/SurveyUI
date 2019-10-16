import React from "react";
import { mount, shallow } from "enzyme";
import Root from "Root";
import {Logout} from "./logout";

const setup = (props = {}, state = null) => {
    const wrapper = mount(
        <Root>
            <Logout/>
        </Root>
    );
    if (state) wrapper.setState(state);
    return wrapper;
};

describe("Logout", () => {
    const wrapper = setup();

    it("should render without crashing", () => {
        expect(wrapper.length).toBe(1);
    });

    it("should render loading model", () => {
        expect(wrapper.find("#logoutLoadingModal").first().length).toBe(1);
    });
});
