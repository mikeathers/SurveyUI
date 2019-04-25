import React from "react";
import { Card, FormGroup, FormRow, Label } from "components/Common";
const CaseDetails = props => {
  return (
    <Card title="Case Details">
      <FormRow>
        <FormGroup flexBasis="100" inline>
          <Label width="20" text="Status:" />
          <p>{props.mi3dCase.status}</p>
        </FormGroup>
      </FormRow>
      <FormRow>
        <FormGroup flexBasis="100" inline>
          <Label width="20" text="Instructing Party:" />
          <p>{props.case.instructingPartyName}</p>
        </FormGroup>
      </FormRow>
      <FormRow>
        <FormGroup flexBasis="100" inline>
          <Label width="20" text="Accepted Disclosure:" />
          <p>{props.mi3dCase.dpaAccepted ? "Yes" : "No"}</p>
        </FormGroup>
      </FormRow>
    </Card>
  );
};
export default CaseDetails;
