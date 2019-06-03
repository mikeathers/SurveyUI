import React, { Component } from "react";
import { connect } from "react-redux";
import { updateMi3dCase } from "actions";
import * as api from "api";
import Modal from "react-modal";
import { Transition } from "react-spring";
import { Button, ButtonContainer } from "components/Common";
import "./DisclosureModal.scss";
class DisclosureModal extends Component {
  state = {
    disclosureDeclined: false
  };
  agreeToDpa = () => {
    this.setState({ disclosureDeclined: false });
    this.props.closeModal();
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
    this.setState({ disclosureDeclined: true });
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

  closeModal = () => {
    this.setState({ disclosureDeclined: false });
    this.props.closeModal();
  };
  render() {
    const show = true;
    return (
      <Transition
        items={show}
        from={{ opacity: 0, transform: "translate3d(100%,0%,0)" }}
        enter={{ opacity: 1, transform: "translate3d(0%,0,0)" }}
        leave={{
          opacity: 0,
          transform: "translate3d(0,100%,0)"
        }}
        delay={600}
      >
        {show =>
          show &&
          (props => (
            <div style={props}>
              <Modal
                ariaHideApp={false}
                isOpen={this.props.isModalOpen}
                contentLabel="Disclosure Statement"
                className="disclosure-modal"
              >
                <div className="disclosure-modal__header">
                  <h3>Disclosure Statement</h3>
                </div>
                <hr />
                <div className="disclosure-modal__body">
                  <p>
                    Hello, my name is{" "}
                    <span className="disclosure-modal__bold">
                      {this.props.username}
                    </span>{" "}
                    and i'm calling from{" "}
                    <span className="disclosure-modal__bold">
                      3d Rehabilitation
                    </span>
                    , we have been asked to contact you by{" "}
                    <span className="disclosure-modal__bold">
                      {this.props.instructingPartyName}
                    </span>{" "}
                    following your recent accident to assess the potential need
                    for physiotherapy.
                    <br />
                    <br />
                    We will be required to process your personal information for
                    the purpose of processing your claim. If you would like to
                    find out about how we process your personal information then
                    please visit our website{" "}
                    <span className="disclosure-modal__bold">
                      www.3drehab.co.uk/privacy-policy
                    </span>{" "}
                    where you will be able to access a copy of our privacy
                    notice.
                    <br />
                    <br />
                    Just to make you aware we monitor calls for training and
                    quality purposes only. Are you still happy to proceed?
                  </p>
                  {this.state.disclosureDeclined && (
                    <p className="disclosure-modal__bold">
                      Unfortunately if we are unable to disclose information to
                      others invloved in the processing of your claim we cannot
                      continue with the questionnaire. Thank you for your time.
                    </p>
                  )}
                </div>
                <hr />
                <div className="disclosure-modal__footer">
                  <ButtonContainer
                    marginTop="20"
                    justifyContent="space-between"
                  >
                    <Button
                      content="Close"
                      secondary
                      onClick={this.closeModal}
                    />
                    <div>
                      <Button
                        content="Declined"
                        secondary
                        onClick={this.disagreeToDpa}
                      />
                      <Button
                        content="Accepted"
                        primary
                        onClick={this.agreeToDpa}
                      />
                    </div>
                  </ButtonContainer>
                </div>
              </Modal>
            </div>
          ))
        }
      </Transition>
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
)(DisclosureModal);
