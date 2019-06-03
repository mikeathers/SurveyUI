import React, { Component } from "react";
import _ from "lodash";
import moment from "moment";
import { connect } from "react-redux";
import { updateMi3dCase } from "actions";
import * as api from "api";

import AddCallBackModal from "./AddCallBackModal/AddCallBackModal";
import CallBackRow from "./CallBackRow/CallBackRow";
import UpdateCallBackModal from "./UpdateCallBackModal/UpdateCallBackModal";

import {
  Card,
  ButtonContainer,
  Button,
  Modal,
  Message,
  Label,
  FlexBox
} from "components/Common";

import "./CallBacks.scss";
import CallBackItem from "./CallBackItem/CallBackItem";

class CallBacks extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      addModalOpen: false,
      removeModalOpen: false,
      updateModalOpen: false,
      selectedCallBack: {},
      message: "",
      showMessage: false,
      errorMessage: false,
      addModalMessage: "",
      showAddModalMessage: false,
      updateModalMessage: "",
      showUpdateModal: false,
      uncompletedCallBacks: false
    };
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  showRemoveModal = callback =>
    this.setState({ removeModalOpen: true, selectedCallBack: callback });
  showUpdateModal = callback =>
    this.setState({ updateModalOpen: true, selectedCallBack: callback });
  closeAddModal = () => this.setState({ addModalOpen: false });
  closeUpdateModal = () => this.setState({ updateModalOpen: false });

  validateResult = res => {
    if (res.status === 200) {
      this.props.updateMi3dCase(res.data);
      if (this._isMounted) {
        this.setState({ showMessage: true });
        setTimeout(() => this.setState({ showMessage: false }), 3000);
      }
    } else {
      if (this._isMounted) {
        this.setState({
          showMessage: true,
          errorMessage: true,
          message: res.data.errors[0].errorMessage
        });
      }
    }
  };

  addCallback = callback => {
    this.setState({ addModalOpen: false });
    api.createCallBack(callback).then(res => {
      this.setState({
        message: "Callback has been added successfully.",
        errorMessage: false
      });
      this.validateResult(res);
    });
  };

  removeCallBack = callback => {
    const callBackToRemove = {
      ...callback,
      caseId: this.props.mi3dCase.caseId,
      actionedBy: this.props.user.name
    };
    this.setState({ removeModalOpen: false });
    api.removeCallBack(callBackToRemove).then(res => {
      this.setState({
        message: "Callback has been removed successfully.",
        errorMessage: false,
        updateModalOpen: false
      });
      this.validateResult(res);
    });
  };

  completeCallBack = callback => {
    this.setState({ updateModalOpen: false });
    api.completeCallBack(callback).then(res => {
      this.setState({
        message: "Callback has been completed successfully.",
        errorMessage: false
      });
      this.validateResult(res);
    });
  };

  rescheduleCallBack = callback => {
    this.setState({ updateModalOpen: false });
    if (this.completedCalls() < 8) {
      api.rescheduleCallBack(callback).then(res => {
        this.setState({
          message: "Callback has been rescheduled successfully.",
          errorMessage: false
        });
        this.validateResult(res);
      });
    } else {
      this.showCallbackLimitReachedMessage();
    }
  };

  moveInitialCallBack = callback => {
    this.setState({ updateModalOpen: false });
    if (this.completedCalls() < 8) {
      api.rescheduleCallBack(callback).then(res => {
        this.setState({
          message: "Callback has been rescheduled successfully.",
          errorMessage: false
        });
        this.validateResult(res);
      });
    } else {
      this.showCallbackLimitReachedMessage();
    }
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
      if (this.callbacks().length > 8) return true;
      else {
        const uncompletedCallBacks = this.callbacks().filter(
          m => m.completed !== true
        );
        if (uncompletedCallBacks.length > 0) return true;
        return false;
      }
    }
  };

  showCallbackLimitReachedMessage = () => {
    this.setState({
      showMessage: true,
      errorMessage: true,
      message: "Callback limit reached, no more callbacks can be scheduled."
    });
  };

  render() {
    return (
      <Card title="Call Backs">
        <div>
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
            <p className="light">No callbacks have been scheduled..</p>
          )}
        </div>
        <FlexBox justifyContent="space-between" alignItems="flex-end">
          <Label
            marginTop="20"
            width="30"
            text={`Attempted Callbacks: ${this.completedCalls()}`}
          />

          <ButtonContainer marginTop={10} justifyContent="flex-end">
            <Message
              show={this.state.showMessage}
              error={this.state.errorMessage}
              message={this.state.message}
              marginRight={45}
            />
            <Button
              disabled={this.isCallbackAllowed()}
              content="Add a call back"
              primary
              onClick={() => this.setState({ addModalOpen: true })}
            />
          </ButtonContainer>
        </FlexBox>
        <AddCallBackModal
          isModalOpen={this.state.addModalOpen}
          closeModal={this.closeAddModal}
          addCallback={this.addCallback}
          show={this.state.showAddModalMessage}
          error={this.state.addModalMessage !== ""}
          message={this.state.addModalMessage}
          mi3dCase={this.props.mi3dCase}
          user={this.props.user}
        />
        <UpdateCallBackModal
          isModalOpen={this.state.updateModalOpen}
          closeModal={this.closeUpdateModal}
          show={this.state.showUpdateModalMessage}
          error={this.state.updateModalMessage !== ""}
          message={this.state.updateModalMessage}
          callback={this.state.selectedCallBack}
          user={this.props.user}
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
            />
            <Button
              content="Remove"
              type="danger"
              onClick={() => this.removeCallBack(this.state.selectedCallBack)}
            />
          </ButtonContainer>
        </Modal>
      </Card>
    );
  }
}
const MapDispatchToProps = dispatch => ({
  updateMi3dCase: updatedCase => dispatch(updateMi3dCase(updatedCase))
});
const mapStateToProps = state => ({
  mi3dCase: state.case.mi3dCase,
  user: state.auth.user
});
export default connect(
  mapStateToProps,
  MapDispatchToProps
)(CallBacks);
