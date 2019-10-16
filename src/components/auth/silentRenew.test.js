import React from "react";
import { mount, shallow } from "enzyme";
import Root from "Root";
import {SilentRenew} from "./silentRenew";

const setup = (props = {}, state = null) => {
    const wrapper = mount(
        <Root>
            <SilentRenew/>
        </Root>
    );
    if (state) wrapper.setState(state);
    return wrapper;
};

describe("SilentRenew", () => {
    const wrapper = setup();

    it("should render without crashing", () => {
        expect(wrapper.length).toBe(1);
    });

    it("should render loading model", () => {
        expect(wrapper.find("#signinSilentCallbackLoadingModal").first().length).toBe(1);
    });
});
