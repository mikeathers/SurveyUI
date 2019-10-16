import React from "react";
import { mount } from "enzyme";
import PSFSScore from "./PSFSScore";
import Activity from "./Activity";
import DatePicker from "react-datepicker";
const props = {
  returnActivities: jest.fn()
};

const wrapper = mount(<PSFSScore {...props} />);

const addActivity = () => {
  const activity = "walk the dog";
  const score = "8";
  const initialScoreDate = new Date();

  wrapper
    .find("#psfsScoreActivitiesTextBox")
    .last()
    .simulate("change", { target: { name: "activity", value: activity } });
  wrapper
    .find("#psfsScoreScoreTextBox")
    .last()
    .simulate("change", { target: { name: "painScore", value: score } });

  const dp = wrapper.find(DatePicker);
  dp.instance().props.onChange(initialScoreDate);

  wrapper.update();

  wrapper
    .find("#psfsScoreAddActivityBtn")
    .first()
    .props()
    .onClick();

  wrapper.update();
};

describe("PSFS Score", () => {
  beforeEach(() => {
    wrapper.setState({
      psfsActivities: [],
      activity: "",
      initialScoreDate: "",
      painScore: "",
      showMessage: false
    });
    wrapper.instance().handleRemoveValidation();
    wrapper.update();
  });

  it("should render without crashing", () => {
    // Assert
    expect(wrapper.find("#psfsScore").first().length).toBe(1);
  });

  it("should display a TextArea for activities to be added", () => {
    // Assert
    expect(wrapper.find("#psfsScoreActivitiesTextBox").first().length).toBe(1);
  });

  it("should display an Input for Score to be added", () => {
    // Assert
    expect(wrapper.find("#psfsScoreScoreTextBox").first().length).toBe(1);
  });

  it("should display a DatePicker for a date to be added", () => {
    // Assert
    expect(wrapper.find("#psfsScoreDatePicker").first().length).toBe(1);
  });

  it("should display a button which will allow an activity to be added", () => {
    // Assert
    expect(wrapper.find("#psfsScoreAddActivityBtn").first().length).toBe(1);
  });

  it("should display a Message when the Add Activity button is clicked and the Activity, Score or Date is empty", () => {
    // Arrange
    expect(
      wrapper
        .find("#psfsScoreMessage")
        .first()
        .prop("show")
    ).toBe(false);

    // Act
    wrapper
      .find("#psfsScoreAddActivityBtn")
      .first()
      .props()
      .onClick();
    wrapper.update();

    // Assert
    expect(
      wrapper
        .find("#psfsScoreMessage")
        .first()
        .prop("show")
    ).toBe(true);
  });

  it("should remove the Message when the Activity textbox gets typed in", () => {
    // Arrange
    wrapper
      .find("#psfsScoreAddActivityBtn")
      .first()
      .props()
      .onClick();
    wrapper.update();
    expect(
      wrapper
        .find("#psfsScoreMessage")
        .first()
        .prop("show")
    ).toBe(true);

    // Act
    wrapper
      .find("#psfsScoreActivitiesTextBox")
      .first()
      .simulate("change", { target: { value: "test" } });
    wrapper.update();

    // Assert
    expect(
      wrapper
        .find("#psfsScoreMessage")
        .first()
        .prop("show")
    ).toBe(false);
  });

  it("should add an error class to the Activity textbox when the Add Activity button is clicked and the Activity text box is empty", () => {
    // Arrange
    expect(
      wrapper
        .find("#psfsScoreActivitiesTextBox")
        .last()
        .hasClass("validate")
    ).toBe(false);
    // Act
    wrapper
      .find("#psfsScoreAddActivityBtn")
      .first()
      .props()
      .onClick();
    wrapper.update();

    // Assert
    expect(
      wrapper
        .find("#psfsScoreActivitiesTextBox")
        .last()
        .hasClass("validate")
    ).toBe(true);
  });

  it("should add an error class to the Score textbox when the Add Activity button is clicked and the Score text box is empty", () => {
    // Arrange
    expect(
      wrapper
        .find("#psfsScoreScoreTextBox")
        .at(1)
        .hasClass("validate")
    ).toBe(false);

    // Act
    wrapper
      .find("#psfsScoreAddActivityBtn")
      .first()
      .props()
      .onClick();
    wrapper.update();
    // Assert
    expect(
      wrapper
        .find("#psfsScoreScoreTextBox")
        .at(1)
        .hasClass("validate")
    ).toBe(true);
  });

  it("should add an Activity component when the Activities textbox, Score textbox, Date textbox have a value and the Add Activity button is clicked", () => {
    // Act
    addActivity();

    // Assert
    expect(wrapper.find(Activity).first().length).toBe(1);
  });

  it("should show a Remove Activity modal when clicking on an added activity", () => {
    // Arrange
    addActivity();

    // Act
    wrapper
      .find(Activity)
      .first()
      .props()
      .removeActivity({ id: 0 });
    wrapper.update();

    // Assert
    expect(
      wrapper.find("#psfsScoreRemoveActivityModal").prop("removeModalOpen")
    ).toBe(true);
  });

  it("should remove the activity and close the modal when clicking on the Remove button inside the modal", () => {
    // Arrange
    addActivity();
    wrapper
      .find(Activity)
      .first()
      .props()
      .removeActivity({ id: 1 });
    wrapper.update();
    expect(
      wrapper.find("#psfsScoreRemoveActivityModal").prop("removeModalOpen")
    ).toBe(true);

    // Act
    wrapper
      .find("#removeActivityModalRemoveBtn")
      .first()
      .props()
      .onClick();
    wrapper.update();

    // Assert
    expect(wrapper.find(Activity).length).toBe(0);
    expect(
      wrapper.find("#psfsScoreRemoveActivityModal").prop("removeModalOpen")
    ).toBe(false);
  });

  it("should show any activities in the list when received in through props", () => {
    // Arrange
    const newProps = {
      ...props,
      psfsActivities: [
        {
          activity: "Walking the dog",
          painScore: 2,
          initialScoreDate: new Date()
        }
      ]
    };

    // Act
    wrapper.setProps({ ...newProps });

    // Assert
    expect(wrapper.find(Activity).length).toBe(1);
  });
});
