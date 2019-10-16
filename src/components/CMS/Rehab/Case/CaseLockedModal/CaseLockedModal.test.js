import React from "react";
import { shallow } from "enzyme";
import CaseLockedModal from "./CaseLockedModal";

const props = {
    caseLockedModalOpen: true,
    lockedBy: "test",
    goBackToCaseList: jest.fn()
};

const wrapper = shallow(<CaseLockedModal {...props}/>);

describe("CaseLockedModalTest", () => {    
    it("should render without crashing", () => {
        //Assert
        expect(wrapper.find("#caseLockedModal").length).toBe(1);
    });

    it("should render title on modal", () => {
        //Assert
        expect(wrapper.find("#caseLockedModalTitle").length).toBe(1);
    });

    it("should render message on modal", () => {
        //Assert
        expect(wrapper.find("#caseLockedModalMessage").length).toBe(1);
    });

    it("should render GoBackButton on modal", () => {
        //Assert
        expect(wrapper.find("#caseLockedModalGoBackButtonContainer").length).toBe(1);
    });

    it("should call goBackToCaseList when the go back button is clicked", () => {
        //Assert
        wrapper.find("#caseLockedModalGoBackButton").props().onClick();
        expect(props.goBackToCaseList).toHaveBeenCalled();
    });

    it("should display the correct locked by message", () => {
        //Assert
        expect(wrapper.find("#caseLockedModalMessage").text()).toBe("The Case is currently being edited by test. Please try again later.")
    })
    
});