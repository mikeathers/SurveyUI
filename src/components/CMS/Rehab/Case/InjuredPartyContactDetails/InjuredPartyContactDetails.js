import React, { Component } from "react";
import * as api from "api";
import { connect } from "react-redux";
import { updateBluedogCase, updateMi3dCase } from "actions";
import {withErrorHandling} from "HOCs";
import ContactNumberModal from "./ContactNumberModal/ContactNumberModal";
import RemoveNumberModal from "./RemoveNumberModal/RemoveNumberModal";
import ContactItem from "./ContactItem/ContactItem";
import { Card, Button, ButtonContainer, Message } from "components/Common";

import "./InjuredPartyContactDetails.scss";

class InjuredPartyContactDetails extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      addNew: false,
      selectedId: "",
      modalOpen: false,
      showMessage: false,
      numberToRemove: "",
      errorMessage: false,
      removeModalOpen: false,
      contactInfoToUpdate: {},
      removeContactDetailSubmitted: false,
      bluedogCase: props.bluedogCase !== undefined ? props.bluedogCase : {}
    };
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentWillReceiveProps({ bluedogCase }) {
    this.setState({ bluedogCase });
  }

  closeModal = () => {
    this.setState({ modalOpen: false, contactInfoToUpdate: {}, addNew: false });
  };

  updateContactInfo = info => {
    this.setState(
      {
        contactInfoToUpdate: info,
        selectedId: info.contactNumberId,
        addNew: false
      },
      () => {
        this.setState({ modalOpen: true });
      }
    );
  };

  activity = action => ({
    action,
    actionedBy: this.props.username,
    caseId: this.props.mi3dCase.caseId
  });

  contactInfoId = () => ({
    contactNumberId: this.state.selectedId,
    bluedogCaseRef: this.state.bluedogCase.bluedogCaseRef
  });

  logActivity = async action => {
    const response = await api.logUpdateToContactDetailsActivity(
      this.activity(action)
    );
    if (response !== undefined) {
      this.props.updateMi3dCase(response.data);
    } else this.props.showErrorModal();
  };

  updateNumber = async contactDetails => {
    const response = await api.updateInjuredPartyContactDetails(contactDetails);
    if (response !== undefined) {
      this.logActivity("Update");
      this.props.updateBluedogCase(response.data);
      this.showSuccessMessage("Contact number has been updated successfully");
    } else this.props.showErrorModal();
  };

  saveNumber = async contactDetails => {
    const response = await api.addInjuredPartyContactDetails(contactDetails);
    if (response !== undefined) {
      if (response.status === 200) {
        this.logActivity("Add");
        this.props.updateBluedogCase(response.data);
        this.showSuccessMessage("Contact number has been saved successfully");
      } else this.showErrorMessage(response.data[0].errorMessage);
    } else this.props.showErrorModal();
  };

  removeNumber = async () => {
    this.setState({ removeContactDetailSubmitted: true });
    const response = await api.removeInjuredPartyContactDetails(
      this.contactInfoId()
    );
    if (response !== undefined) {
      this.logActivity("Remove");
      this.showSuccessMessage("Contact number has been removed successfully");
      this.props.updateBluedogCase(response.data);
    } else {
      this.setState({ removeContactDetailSubmitted: false });
      this.props.showErrorModal();
    }
  };

  showSuccessMessage = message => {
    this.setState({
      message,
      modalOpen: false,
      showMessage: true,
      errorMessage: false,
      removeModalOpen: false,
      contactInfoToUpdate: {}
    });
    setTimeout(() => this.setState({ showMessage: false }), 3000);
  };

  showErrorMessage = message => {
    this.setState({
      message,
      modalOpen: false,
      showMessage: true,
      errorMessage: true,
      removeModalOpen: false,
      contactInfoToUpdate: {}
    });
    setTimeout(() => this.setState({ showMessage: false }), 3000);
  };

  showRemoveModal = (id, number) => {
    this.setState({
      removeModalOpen: true,
      selectedId: id,
      numberToRemove: number
    });
  };

  closeRemoveModal = () => {
    this.setState({ removeModalOpen: false });
  };

  render() {
    const { bluedogCase } = this.state;
    return (
      <Card title="Contact Details" collapse={false}>
        <div className="scrollable-card">
          {bluedogCase !== undefined &&
            bluedogCase.telephoneInfo !== undefined &&
            bluedogCase.telephoneInfo.map((info, key) => {
              return (
                <ContactItem
                  info={info}
                  key={key}
                  updateContactInfo={() => this.updateContactInfo(info)}
                  showRemoveModal={() =>
                    this.showRemoveModal(
                      info.contactNumberId,
                      info.contactNumber
                    )
                  }
                />
              );
            })}
        </div>
        <ButtonContainer marginTop="15" justifyContent="flex-end">
          <Message
            marginRight={45}
            message={this.state.message}
            show={this.state.showMessage}
            error={this.state.errorMessage}
          />
          <Button
            content="Add a number"
            primary
            onClick={() =>
              this.setState({
                modalOpen: true,
                addNew: true
              })
            }
          />
        </ButtonContainer>
        <ContactNumberModal
          addNew={this.state.addNew}
          closeModal={this.closeModal}
          saveNumber={this.saveNumber}
          updateNumber={this.updateNumber}
          isModalOpen={this.state.modalOpen}
          telephoneInfo={this.state.contactInfoToUpdate}
          bluedogCaseRef={this.state.bluedogCase.bluedogCaseRef}
          partyId={
            this.state.bluedogCase !== undefined &&
            this.state.bluedogCase.partyId
          }
          showRemoveModal={() =>
            this.showRemoveModal(
              this.state.contactInfoToUpdate.contactNumberId,
              this.state.contactInfoToUpdate.contactNumber
            )
          }
        />
        <RemoveNumberModal
          closeModal={this.closeRemoveModal}
          removeContactDetail={this.removeNumber}
          isModalOpen={this.state.removeModalOpen}
          numberToRemove={this.state.numberToRemove}
          removeContactDetailSubmitted={this.removeContactDetailSubmitted}
        />
      </Card>
    );
  }
}

export default withErrorHandling(InjuredPartyContactDetails);
