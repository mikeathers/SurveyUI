import React from "react";
import { mount, shallow } from "enzyme";
import Root from "Root";
import {Callback} from "./Callback";

import context from '../../providers/TestAuthContext';
jest.mock('../../providers/authProvider')

const setup = (props = {}, state = null) => {
    const wrapper = mount(
        <Root>
            <Callback/>
        </Root>
    );
    if (state) wrapper.setState(state);
    return wrapper;
};

describe("Callback", () => {
    const wrapper = setup();

    it("should render without crashing", () => {
        expect(wrapper.length).toBe(1);
    });

    it("should render loading model", () => {
        expect(wrapper.find("#signinRedirectCallbackLoadingModal").first().length).toBe(1);
    });

    // it("should call signinRedirectCallback", ()=>{
    //     expect(context.signinRedirectCallback.mock.calls.length).toBe(1);
    // })
});
