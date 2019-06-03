import React, { Component } from "react";
import { connect } from "react-redux";
import { updateMi3dCase } from "actions";
import * as api from "api";

import { Card, ButtonContainer, Button } from "components/Common";
import CaseModal from "components/CMS/Rehab/Case/CaseModal/CaseModal";

import "./DPAScript.scss";

class DPAScript extends Component {
  constructor(props) {
    super(props);
    this.state = {
      caseModalOpen: false
    };
  }
  agreeToDpa = () => {
    const dpa = {
      dpaAccepted: true,
      caseId: this.props.mi3dCase.caseId,
      actionedBy: this.props.username
    };
    api.agreeToDpa(dpa).then(res => {
      if (res.status === 200) {
        this.props.updateMi3dCase(res.data);
      }
    });
  };
  disagreeToDpa = () => {
    this.setState({ caseModalOpen: true });
    const dpa = {
      acceptedDpa: false,
      caseId: this.props.mi3dCase.caseId,
      actionedBy: this.props.username
    };
    api.agreeToDpa(dpa).then(res => {
      if (res.status === 200) {
        this.props.updateMi3dCase(res.data);
      }
    });
  };
  render() {
    const { username, instructingPartyName } = this.props;
    const text =
      "Unfortunately if we are unable to disclose information to others invloved in the processing of your claim we cannot continue with the questionnaire. Thank you for your time.";
    return (
      <Card title="DPA Disclosure Statement">
        <p>
          Hello, my name is <strong>{username}</strong> and i'm calling from{" "}
          <strong>3d Rehabilitation</strong>, we have been asked to contact you
          by <strong>{instructingPartyName}</strong> following your recent
          accident to assess the potential need for physiotherapy.
          <br />
          <br />
          We will be required to process your personal information for the
          purpose of processing your claim. If you would like to find out about
          how we process your personal information then please visit our website{" "}
          <strong>www.3drehab.co.uk/privacy-policy</strong> where you will be
          able to access a copy of our privacy notice.
          <br />
          <br />
          Just to make you aware we monitor calls for training and quality
          purposes only. Are you still happy to proceed?
        </p>
        <ButtonContainer marginTop="25" justifyContent="flex-end">
          <Button content="Declined" secondary onClick={this.disagreeToDpa} />
          <Button content="Accepted" primary onClick={this.agreeToDpa} />
        </ButtonContainer>
        <CaseModal
          isModalOpen={this.state.caseModalOpen}
          buttonContent="Hold Case"
          title="Put the case on hold"
          closeModal={() => this.setState({ caseModalOpen: false })}
          reasonText="Reason for putting the case on hold:"
          modalHeight="430"
          text={text}
        />
      </Card>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  updateMi3dCase: updatedCase => dispatch(updateMi3dCase(updatedCase))
});

const mapStateToProps = state => ({
  mi3dCase: state.case.mi3dCase,
  username: state.auth.user.name,
  instructingPartyName: state.case.selectedCase.instructingPartyName
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DPAScript);
