import React from "react";
import { mount } from "enzyme";
import Root from "Root";
import Surveys from "./Surveys";
window.scrollTo = jest.fn();
const bluedogCase = {
  bluedogCaseRef: "20007511/1",
  title: "",
  partyId: "27365",
  lastName: "Thornton-Allen",
  firstName: "Garry",
  houseNo: "170",
  address1: "Chorley New Road",
  address2: "Horwhich",
  address3: "Bolton",
  address4: "",
  houseNoWithRoad: " 70 Chorley New Road",
  country: "United Kingdom",
  postCode: "BL6 6JW",
  instructingPartyName: "Direct Line Insurance (Pilot)",
  email: "",
  dateOfBirth: "1976-02-02T00:00:00.0000000",
  incidentDate: "2017-11-20T00:00:00.0000000",
  age: "42",
  instructingPartyId: "27253",
  instructingPartyRef: "NonF2F",
  instructingParty: {
    address1: "",
    address2: "",
    address3: "",
    address4: ""
  }
};

const defaultProps = {
  history: {
    location: {
      pathname: "initialSurvey"
    }
  },
  mi3dCase: {
    completedClinicianSurvey: {},
    completedDischargeSurvey: {},
    completedSOAPSurvey: {}
  }
};

const setup = (props = {}, state = null) => {
  const wrapper = mount(
    <Root>
      <Surveys {...props} />
    </Root>
  );
  if (state) wrapper.setState(state);
  return wrapper;
};

const wrapper = setup({ ...defaultProps });

describe("Surveys", () => {
  it("should render without crashing", () => {
    expect(wrapper.length).toBe(1);
  });

  it("should render the InitialSurvey if 'initial' is found in the current url", () => {
    // Arrange
    const wrapper = setup({
      history: {
        location: {
          pathname: "initialSurvey"
        }
      },
      completedSurveys: []
    });

    // Assert
    expect(wrapper.find("#initialSurvey").first().length).toBe(1);
    expect(wrapper.find("#clinicianSurvey").first().length).toBe(0);
    expect(wrapper.find("#soapSurvey").first().length).toBe(0);
    expect(wrapper.find("#dischargeSurvey").first().length).toBe(0);
  });

  it("should render the ClinicianSurvey if 'clinician' is found in the current url", () => {
    // Arrange
    const wrapper = setup({
      history: {
        location: {
          pathname: "clinicianSurvey"
        }
      },
      completedSurveys: [],
      completedClinicianSurvey: {}
    });

    // Assert
    expect(wrapper.find("#initialSurvey").first().length).toBe(0);
    expect(wrapper.find("#clinicianSurvey").first().length).toBe(1);
    expect(wrapper.find("#soapSurvey").first().length).toBe(0);
    expect(wrapper.find("#dischargeSurvey").first().length).toBe(0);
  });

  it("should render the SOAPSurvey if 'soap' is found in the current url", () => {
    // Arrange
    const wrapper = setup({
      history: {
        location: {
          pathname: "soapSurvey"
        }
      },
      completedSurveys: [],
      completedSOAPSurvey: {}
    });
    // Assert
    expect(wrapper.find("#initialSurvey").first().length).toBe(0);
    expect(wrapper.find("#clinicianSurvey").first().length).toBe(0);
    expect(wrapper.find("#soapSurvey").first().length).toBe(1);
    expect(wrapper.find("#dischargeSurvey").first().length).toBe(0);
  });

  it("should render the DischargeSurvey if 'discharge' is found in the current url", () => {
    // Arrange
    const wrapper = setup({
      history: {
        location: {
          pathname: "dischargeSurvey"
        }
      },
      completedSurveys: [],
      completedDischargeSurvey: {},
      completedClinicianSurvey: {}
    });

    // Assert
    expect(wrapper.find("#initialSurvey").first().length).toBe(0);
    expect(wrapper.find("#clinicianSurvey").first().length).toBe(0);
    expect(wrapper.find("#soapSurvey").first().length).toBe(0);
    expect(wrapper.find("#dischargeSurvey").first().length).toBe(1);
  });

  it("should show stop case modal when openStopCaseModal is called from child components", () => {
    // Arrange
    expect(
      wrapper
        .find("#stopCaseModal")
        .first()
        .prop("isModalOpen")
    ).toBe(false);

    const surveys = wrapper.find(Surveys).first();

    // Act
    surveys
      .childAt(0)
      .instance()
      .handleOpenStopCaseModal("", "", "");
    wrapper.update();

    // Assert
    expect(
      wrapper
        .find("#stopCaseModal")
        .first()
        .prop("isModalOpen")
    ).toBe(true);
  });
});
