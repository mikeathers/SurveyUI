import React from "react";
import moment from "moment";
import { FormRow, FormGroup, Label } from "components/Common";

const EmailTemplateInfo = ({ selectedTemplate }) => {
  return (
    <div>
      <FormRow>
        <FormGroup flexBasis="30">
          <Label text="Template Name:" />
          <Label text={selectedTemplate.name} thin />
        </FormGroup>
        <FormGroup flexBasis="30" width="100">
          <Label text="Associated Letter:" />
          <Label text={selectedTemplate.letterTemplate.name} thin />
        </FormGroup>
        <FormGroup flexBasis="30">
          <Label text="Send To:" />
          <Label text={selectedTemplate.sendTo} thin />
        </FormGroup>
      </FormRow>
      <FormRow>
        <FormGroup flexBasis="30">
          <Label text="Created By:" />
          <Label text={selectedTemplate.createdBy} thin />
        </FormGroup>
        <FormGroup flexBasis="30">
          <Label text="Last Updated By:" />
          <Label text={selectedTemplate.lastUpdatedBy} thin />
        </FormGroup>
        <FormGroup flexBasis="30">
          <Label text="Last Updated On:" />
          <Label
            text={moment(selectedTemplate.lastUpdatedOn).format(
              "DD/MM/YYYY hh:mm A"
            )}
            thin
            width="100"
          />
        </FormGroup>
      </FormRow>
    </div>
  );
};

export default EmailTemplateInfo;
