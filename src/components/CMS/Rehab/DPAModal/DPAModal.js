import React, { Component } from "react";
import * as api from "api";
import * as emailTemplates from "helpers/emailTemplates";
import * as systemActivities from "helpers/systemActivities";

import { connect } from "react-redux";
import { updateMi3dCase } from "actions";
import Modal from "react-modal";
import {withErrorHandling} from "HOCs";

import {
  emailInstructingParty,
  getBluedogInjuredPartyValues
} from "helpers/email";

import { addSystemActivity, updateSystemActivity } from "helpers/util";

import InjuredPartyDetails from "../Case/InjuredPartyDetails/InjuredPartyDetails";
import InjuredPartyContactDetails from "../Case/InjuredPartyContactDetails/InjuredPartyContactDetails";
import { ButtonContainer, Button } from "components/Common";

import "./DPAModal.scss";

class DPAModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dpaDeclined: false
    };
    this.emailInstructingParty = emailInstructingParty.bind(this);
    this.getBluedogInjuredPartyValues = getBluedogInjuredPartyValues.bind(this);
    this.addSystemActivity = addSystemActivity.bind(this);
    this.updateSystemActivity = updateSystemActivity.bind(this);
  }

  componentDidMount() {
    this.getBluedogInjuredPartyValues(this.props.bluedogCase);
  }

  dpa = accepted => ({
    dpaAccepted: accepted,
    disclosureAccepted: accepted,
    actionedBy: this.props.username,
    caseId: this.props.mi3dCase.caseId
  });

  disclosureAccepted = accepted => ({
    disclosureAccepted: accepted,
    actionedBy: this.props.username,
    caseId: this.props.mi3dCase.caseId
  });

  agreeToDpa = async () => {
    this.setState({ dpaDeclined: false });
    this.props.closeModal();
    const agreeToDpaResponse = await api.agreeToDpa(this.dpa(true));
    if (agreeToDpaResponse === undefined) this.props.showErrorModal();
    if (agreeToDpaResponse !== undefined) {
      if (agreeToDpaResponse.status === 200) {
        const agressToDisclosureResult = await api.agreeToDisclosure(
          this.disclosureAccepted(true)
        );
        if (agressToDisclosureResult !== undefined)
          this.props.updateMi3dCase(agressToDisclosureResult.data);
      } else this.props.showErrorModal();
    } else this.props.showErrorModal();
  };

  disagreeToDpa = async () => {
    this.setState({ dpaDeclined: true });
    this.props.closeModal();
    const agreeToDpaResult = await api.agreeToDpa(this.dpa(false));
    if (agreeToDpaResult !== undefined) {
      if (agreeToDpaResult.status === 200) {
        const agressToDisclosureResult = await api.agreeToDisclosure(
          this.disclosureAccepted(false)
        );
        if (agressToDisclosureResult !== undefined)
          this.props.updateMi3dCase(agressToDisclosureResult.data);
        await this.placeCaseOnHold("Injured Party Failed DPA");
        await this.handleEmailInstructingParty();
      } else this.props.showErrorModal();
    } else this.props.showErrorModal();
  };

  handleEmailInstructingParty = async () => {
    const { bluedogCaseValues } = this.state;
    const emailTemplateName = emailTemplates.emailInsPDPAFailed;
    const activity = systemActivities.emailInsPDPAFailed;
    const systemActivity = {
      activity,
      type: "Email",
      state: "Pending",
      emailTemplateName: null,
      bluedogActionName: null,
      surveyDocumentNeedsSending: false,
      sendTo: "Instructing Party"
    };
    await this.emailInstructingParty(
      systemActivity,
      emailTemplateName,
      bluedogCaseValues
    );
  };

  placeCaseOnHold = async holdCaseReason => {
    const holdCaseInfo = {
      holdCaseReason,
      caseId: this.props.mi3dCase.caseId
    };

    const response = await api.placeCaseOnHold(holdCaseInfo);

    if (response !== undefined) {
      if (response.status === 200) this.props.updateMi3dCase(response.data);
      else this.showErrorMessage(response.data[0].errorMessage);
    } else this.props.showErrorModal();
  };

  closeModal = () => {
    this.setState({ dpaDeclined: false });
    this.props.closeModal();
  };

  dpaAlreadyFailed = () => {
    return this.props.mi3dCase.dpaAccepted === false;
  };

  render() {
    return (
      <Modal
        id="dpaModal"
        ariaHideApp={false}
        isOpen={this.props.isModalOpen}
        contentLabel="Data Protection Act"
        className="dpa-modal"
      >
        <div className="dpa-modal__container">
          <div className="dpa-modal__title">
            <h3>Data Protection Act</h3>
          </div>
          <div className="dpa-modal__body">
            <div className="dpa-modal__opening-statement">
              <p>
                Hello, my name is{" "}
                <span className="dpa-modal__bold">{this.props.username}</span>{" "}
                and I am calling from{" "}
                <span className="dpa-modal__bold">Mi3D</span> and we have been
                asked to contact you by{" "}
                <span className="dpa-modal__bold">
                  {this.props.instructingPartyName}.
                </span>
              </p>
              <p>
                1. For data protection, please confirm the first line of your
                address .
              </p>{" "}
              <p> 2. For data protection, please confirm your data of birth.</p>
              <p>
                3. We have been requested to ask you a few questions regarding
                your injury which may be of sensitive nature, are you ok to
                proceed?
              </p>
            </div>

            <InjuredPartyDetails id="dpaInjuredPartyDetails" />
            <InjuredPartyContactDetails
              id="dpaInjuredPartyContactDetails"
              mi3dCase={this.props.mi3dCase}
              username={this.props.username}
              bluedogCase={this.props.bluedogCase}
              updateMi3dCase={this.props.updateMi3dCase}
              updateBluedogCase={this.props.updateBluedogCase}
            />

            <div className="dpa-modal__closing-statement">
              <h3>Disclosure Statement</h3>
              <p>
                We will be required to process your personal information for the
                purpose of processing your claim. If you would like to find out
                about how we process your personal information then please visit
                our website www.3drehab.co.uk/privacy-policy where you will be
                able to access a copy of our privacy notice.
              </p>
              <p>
                {" "}
                Just to make you aware we monitor calls for training and quality
                purposes only. Are you still happy to proceed?
              </p>
            </div>
          </div>
          <div className="dpa-modal__footer">
            <ButtonContainer justifyContent="space-between" marginTop="40">
              <Button content="Close" onClick={this.closeModal} secondary />
              <div>
                <Button
                  content="DPA Failed"
                  secondary
                  onClick={this.disagreeToDpa}
                />
                <Button
                  content="DPA Passed"
                  primary
                  onClick={this.agreeToDpa}
                />
              </div>
            </ButtonContainer>
          </div>
        </div>
      </Modal>
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

export default withErrorHandling(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DPAModal)
);
