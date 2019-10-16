import React, { Component } from "react";
import _ from "lodash";
import * as api from "api";
import moment from "moment";
import * as emailTemplates from "helpers/emailTemplates";
import * as systemActivities from "helpers/systemActivities";

import {withErrorHandling} from "HOCs";
import { addSystemActivity, updateSystemActivity } from "helpers/util";

import CallBackRow from "./CallBackRow/CallBackRow";
import AddCallBackModal from "./AddCallBackModal/AddCallBackModal";
import UpdateCallBackModal from "./UpdateCallBackModal/UpdateCallBackModal";

import {
  emailInjuredParty,
  emailInstructingParty,
  getBluedogInjuredPartyValues
} from "helpers/email";

import {
  Card,
  Label,
  Modal,
  Button,
  Message,
  FlexBox,
  ButtonContainer
} from "components/Common";

import "./CallBacks.scss";
import CallBackItem from "./CallBackItem/CallBackItem";

class CallBacks extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      showMessage: false,
      errorMessage: false,
      addModalOpen: false,
      addModalMessage: "",
      selectedCallBack: {},
      bluedogCaseValues: [],
      updateModalMessage: "",
      removeModalOpen: false,
      updateModalOpen: false,
      showUpdateModal: false,
      showAddModalMessage: false,
      uncompletedCallBacks: false,
      removeCallbackSubmitted: false
    };
    this.getBluedogInjuredPartyValues = getBluedogInjuredPartyValues.bind(this);
    this.addSystemActivity = addSystemActivity.bind(this);
    this.updateSystemActivity = updateSystemActivity.bind(this);
    this.emailInstructingParty = emailInstructingParty.bind(this);
    this.emailInjuredParty = emailInjuredParty.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    if (this.props.bluedogCase !== undefined)
      this.getBluedogInjuredPartyValues(this.props.bluedogCase);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  closeAddModal = () => this.setState({ addModalOpen: false });

  closeUpdateModal = () => this.setState({ updateModalOpen: false });

  showRemoveModal = callback => {
    this.setState({ removeModalOpen: true, selectedCallBack: callback });
  };

  showUpdateModal = callback => {
    this.setState({ updateModalOpen: true, selectedCallBack: callback });
  };

  callBackToRemove = callback => ({
    ...callback,
    caseId: this.props.mi3dCase.caseId,
    actionedBy: this.props.username
  });

  removeCallBack = async callback => {
    this.setState({ removeCallbackSubmitted: true });
    const response = await api.removeCallBack(this.callBackToRemove(callback));
    this.setState({ removeModalOpen: false });
    if (response !== undefined) {
      if (response.status === 200) {
        this.props.updateMi3dCase(response.data);
        this.setState({ removeCallbackSubmitted: false });
        this.showSuccessMessage("Callback has been removed successfully");
      } else this.showErrorMessage(response.data[0].errorMessage);
    } else {
      this.setState({ removeCallbackSubmitted: false });
      this.props.showErrorModal();
    }
  };

  addCallback = async callback => {
    const response = await api.createCallBack(callback);
    this.setState({ addModalOpen: false });
    if (response !== undefined) {
      if (response.status === 200) {
        this.showSuccessMessage("Callback has been added successfully");
        this.props.updateMi3dCase(response.data);
      } else this.showErrorMessage(response.data[0].errorMessage);
    } else this.props.showErrorModal();
  };

  completeCallBack = async callback => {
    const response = await api.completeCallBack(callback);
    this.setState({ updateModalOpen: false });
    if (response !== undefined) {
      if (response.status === 200) {
        this.props.updateMi3dCase(response.data);
        this.showSuccessMessage("Callback has been completed successfully.");
      } else this.showErrorMessage(response.data[0].errorMessage);
    } else this.props.showErrorModal();
  };

  completeFinalNonCompliantCallBack = async callback => {
    this.setState({ updateModalOpen: false });
    const response = await api.completeCallBack(callback);
    if (response !== undefined) {
      if (response.status === 200) {
        this.props.updateMi3dCase(response.data);
      } else this.showErrorMessage(response.data[0].errorMessage);
    } else this.props.showErrorModal();
  };

  rescheduleCallBack = async callback => {
    if (this.completedCalls() < 6) {
      const response = await api.rescheduleCallBack(callback);
      this.setState({ updateModalOpen: false });
      if (response !== undefined) {
        if (response.status === 200) {
          this.showSuccessMessage("Callback has been rescheduled successfully");
          this.props.updateMi3dCase(response.data);
        } else this.showErrorMessage(response.data[0].errorMessage);
      } else this.props.showErrorModal();
    } else {
      this.showCallbackLimitReachedMessage();
      this.completeFinalNonCompliantCallBack(callback);
      await this.placeCaseOnHold("Injured Party Non-Compliant");
      await this.handleEmailInstructingParty();
      await this.handleEmailInjuredParty();
    }
  };

  moveInitialCallBack = async callback => {
    if (this.completedCalls() < 6) {
      const response = await api.rescheduleCallBack(callback);
      this.setState({ updateModalOpen: false });
      if (response !== undefined) {
        if (response.status === 200) {
          this.showSuccessMessage("Callback has been rescheduled successfully");
          this.props.updateMi3dCase(response.data);
        } else this.showErrorMessage(response.data[0].errorMessage);
      } else this.props.showErrorModal();
    } else {
      this.showCallbackLimitReachedMessage();
      this.completeFinalNonCompliantCallBack(callback);
      await this.placeCaseOnHold("Injured Party Non-Compliant");
      await this.handleEmailInstructingParty();
      await this.handleEmailInjuredParty();
    }
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

  callbacks = () => {
    return _.orderBy(
      this.props.mi3dCase.callBacks,
      [m => m.completed, m => m.timeToCall],
      ["asc"]
    );
  };

  completedCalls = () => {
    return this.callbacks().filter(m => m.completed === true).length;
  };

  isCallbackAllowed = () => {
    if (this.callbacks().length > 0) {
      if (this.callbacks().length > 6) return true;
      else {
        const uncompletedCallBacks = this.callbacks().filter(
          m => m.completed !== true
        );
        return uncompletedCallBacks.length > 0 ? true : false;
      }
    }
  };

  handleEmailInstructingParty = async () => {
    const { bluedogCaseValues } = this.state;

    const emailTemplateName = emailTemplates.emailInsPCallBackLimitReached;
    const activity = systemActivities.emailInsPCallBackNonCompliance;

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

  handleEmailInjuredParty = async () => {
    const { bluedogCaseValues } = this.state;

    const emailTemplateName = emailTemplates.emailIPCallBackLimitReached;
    const activity = systemActivities.emailIPCallBackNonCompliance;

    const systemActivity = {
      activity,
      type: "Email",
      state: "Pending",
      emailTemplateName: null,
      bluedogActionName: null,
      surveyDocumentNeedsSending: false,
      sendTo: "Injured Party"
    };

    await this.emailInjuredParty(
      systemActivity,
      emailTemplateName,
      bluedogCaseValues
    );
  };

  showCallbackLimitReachedMessage = () => {
    this.setState({
      showMessage: true,
      errorMessage: true,
      message:
        "No more callbacks can be added as the callback limit has been reached."
    });
    setTimeout(() => this.setState({ showMessage: false }), 3000);
  };

  showSuccessMessage = message => {
    this.setState({
      message,
      showMessage: true,
      errorMessage: false,
      updateModalOpen: false
    });
    setTimeout(() => this.setState({ showMessage: false }), 3000);
  };

  showErrorMessage = message => {
    this.setState({
      message,
      showMessage: true,
      errorMessage: true
    });
    setTimeout(() => this.setState({ showMessage: false }), 3000);
  };

  render() {
    return (
      <Card title="Call Backs">
        <div className="scrollable-card">
          {this.callbacks().length > 0 ? (
            <div>
              <table className="callback-table">
                <thead>
                  <tr>
                    <td>
                      <p>Time to call</p>
                    </td>
                    <td>
                      <p>Type</p>
                    </td>
                    <td>
                      <p>Completed</p>
                    </td>
                    <td>
                      <p>Completed on</p>
                    </td>
                    <td>
                      <p>Completed by</p>
                    </td>
                  </tr>
                </thead>
                <tbody>
                  {this.callbacks().map((callback, key) => (
                    <CallBackRow
                      key={key}
                      callback={callback}
                      showRemoveModal={() => this.showRemoveModal(callback)}
                      showUpdateModal={
                        !callback.completed
                          ? () => this.showUpdateModal(callback)
                          : null
                      }
                    />
                  ))}
                </tbody>
              </table>

              <div>
                <div className="callback-list">
                  {this.callbacks().map((callback, key) => (
                    <CallBackItem
                      key={key}
                      callback={callback}
                      showRemoveModal={() => this.showRemoveModal(callback)}
                      showUpdateModal={
                        !callback.completed
                          ? () => this.showUpdateModal(callback)
                          : null
                      }
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="light">No callbacks have been scheduled...</p>
          )}
        </div>
        <FlexBox justifyContent="space-between" alignItems="flex-end">
          <Label
            marginTop="20"
            text={`Attempted Callbacks: ${this.completedCalls()}`}
          />

          <ButtonContainer marginTop={10} justifyContent="flex-end">
            <Button
              disabled={this.isCallbackAllowed()}
              content="Add a call back"
              primary
              onClick={() => this.setState({ addModalOpen: true })}
            />
          </ButtonContainer>
        </FlexBox>
        <FlexBox justifyContent="flex-end" marginTop="15">
          <Message
            show={this.state.showMessage}
            error={this.state.errorMessage}
            message={this.state.message}
          />
        </FlexBox>
        <AddCallBackModal
          isModalOpen={this.state.addModalOpen}
          closeModal={this.closeAddModal}
          addCallback={this.addCallback}
          show={this.state.showAddModalMessage}
          error={this.state.addModalMessage !== ""}
          message={this.state.addModalMessage}
          mi3dCase={this.props.mi3dCase}
          username={this.props.username}
          updateMi3dCase={this.props.updateMi3dCase}
          addCallback={this.addCallback}
        />
        <UpdateCallBackModal
          isModalOpen={this.state.updateModalOpen}
          closeModal={this.closeUpdateModal}
          show={this.state.showUpdateModalMessage}
          error={this.state.updateModalMessage !== ""}
          message={this.state.updateModalMessage}
          callback={this.state.selectedCallBack}
          username={this.props.username}
          mi3dCase={this.props.mi3dCase}
          completeCallBack={this.completeCallBack}
          rescheduleCallBack={this.rescheduleCallBack}
          moveInitialCallBack={this.moveInitialCallBack}
          showRemoveModal={() =>
            this.showRemoveModal(this.state.selectedCallBack)
          }
        />
        <Modal
          isModalOpen={this.state.removeModalOpen}
          title="Remove Call Back"
          message="Are you sure you want to remove this call back?"
          item={moment(this.state.selectedCallBack.timeToCall).format(
            "DD/MM/YYYY hh:mm A"
          )}
        >
          <ButtonContainer justifyContent="flex-end">
            <Button
              content="Close"
              secondary
              onClick={() => this.setState({ removeModalOpen: false })}
              disabled={this.state.removeCallbackSubmitted}
            />
            <Button
              content="Remove"
              type="danger"
              onClick={() => this.removeCallBack(this.state.selectedCallBack)}
              disabled={this.state.removeCallbackSubmitted}
            />
          </ButtonContainer>
        </Modal>
      </Card>
    );
  }
}

export default withErrorHandling(CallBacks);
