import React from "react";
import { shallow } from "enzyme";
import CaseAdmin from "./CaseAdmin";
import StopCaseReasons from "components/CMS/Admin/CaseAdmin/StopCaseReasons/StopCaseReasons/StopCaseReasons";
import EmailTemplates from "components/CMS/Admin/CaseAdmin/Templates/EmailTemplates/EmailTemplates/EmailTemplates";
import LetterTemplates from "components/CMS/Admin/CaseAdmin/Templates/LetterTemplates/LetterTemplates/LetterTemplates";

const wrapper = shallow(<CaseAdmin />);

it("should render EmailTemplates when emailTemplates is the selectedItem in state", () => {
  wrapper.setState({ selectedItem: "emailTemplates" });
  expect(wrapper.state().selectedItem).toEqual("emailTemplates");

  expect(wrapper.find(LetterTemplates)).toHaveLength(0);
  expect(wrapper.find(EmailTemplates)).toHaveLength(1);
  expect(wrapper.find(StopCaseReasons)).toHaveLength(0);
});

it("should render LetterTemplates when letterTemplates is the selectedItem in state", () => {
  wrapper.setState({ selectedItem: "letterTemplates" });
  expect(wrapper.state().selectedItem).toEqual("letterTemplates");

  expect(wrapper.find(LetterTemplates)).toHaveLength(1);
  expect(wrapper.find(EmailTemplates)).toHaveLength(0);
  expect(wrapper.find(StopCaseReasons)).toHaveLength(0);
});

it("should render StopCaseReasons when caseReasons is the selectedItem in state", () => {
  wrapper.setState({ selectedItem: "caseReasons" });
  expect(wrapper.state().selectedItem).toEqual("caseReasons");

  expect(wrapper.find(LetterTemplates)).toHaveLength(0);
  expect(wrapper.find(EmailTemplates)).toHaveLength(0);
  expect(wrapper.find(StopCaseReasons)).toHaveLength(1);
});
