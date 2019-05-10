import React, { Component } from "react";
import { connect } from "react-redux";
import { updateBluedogCase, updateMi3dCase } from "actions";
import * as api from "api";

import { Card, Button, ButtonContainer, Message } from "components/Common";
import ContactNumberModal from "./ContactNumberModal/ContactNumberModal";
import RemoveNumberModal from "./RemoveNumberModal/RemoveNumberModal";
import ContactRow from "./ContactRow/ContactRow";

import "./InjuredPartyContactDetails.scss";

class InjuredPartyContactDetails extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      contactInfoToUpdate: {},
      selectedId: "",
      addNew: false,
      showMessage: false,
      errorMessage: false,
      message: "",
      modalOpen: false,
      removeModalOpen: false,
      numberToRemove: ""
    };
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
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

  logActivity = (res, action) => {
    if (res.status === 200) {
      this.setState({
        showMessage: true,
        modalOpen: false,
        removeModalOpen: false
      });
      setTimeout(() => this.setState({ showMessage: false }), 3000);
      this.props.updateBluedogCase(res.data);
      const activity = {
        action,
        caseId: this.props.mi3dCase.caseId,
        actionedBy: this.props.user.name
      };
      api.logUpdateToContactDetailsActivity(activity).then(res => {
        this.props.updateMi3dCase(res.data.result);
      });
    } else {
      this.setState({
        showMessage: true,
        message: res.data,
        errorMessage: true
      });
      this.closeModal();
    }
  };

  updateNumber = newContactDetails => {
    api.updateInjuredPartyContactDetails(newContactDetails).then(res => {
      if (this._isMounted) {
        this.setState({
          message: "Contact number updated successfully.",
          errorMessage: false
        });
        this.logActivity(res, "Update");
      }
    });
  };

  saveNumber = newContactDetails => {
    api.addInjuredPartyContactDetails(newContactDetails).then(res => {
      if (this._isMounted) {
        this.setState({
          message: "Contact number saved successfully.",
          errorMessage: false
        });
        this.logActivity(res, "Add");
      }
    });
  };

  removeNumber = () => {
    const contactInfo = {
      contactNumberId: this.state.selectedId,
      bluedogCaseRef: this.props.case.bluedogCaseRef
    };
    api.removeInjuredPartyContactDetails(contactInfo).then(res => {
      if (this._isMounted) {
        if (res.status === 200) {
          const newDetails = res.data.telephoneInfo.find(
            m => m.contactNumberId === this.state.selectedId
          );
          this.setState({ contactInfoToUpdate: newDetails });
        }
        this.setState({
          message: "Contact number removed successfully.",
          errorMessage: false
        });
        this.logActivity(res, "Remove");
      }
    });
  };

  showRemoveModal = (id, number) =>
    this.setState({
      removeModalOpen: true,
      selectedId: id,
      numberToRemove: number
    });

  closeRemoveModal = () => {
    this.setState({ removeModalOpen: false });
  };

  render() {
    return (
      <Card title="Contact Details" collapse={false}>
        <div>
          <table className="contact-details-table">
            <thead>
              <tr>
                <td>
                  <p>Type</p>
                </td>
                <td>
                  <p>Number</p>
                </td>
                <td>
                  <p>Preferred</p>
                </td>
                <td>
                  <p>Notes</p>
                </td>
              </tr>
            </thead>
            <tbody>
              {this.props.case.telephoneInfo.map((info, key) => {
                return (
                  <ContactRow
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
            </tbody>
          </table>
          <ButtonContainer marginTop={5} justifyContent="flex-end">
            <Message
              show={this.state.showMessage}
              error={this.state.errorMessage}
              message={this.state.message}
              marginRight={45}
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
            isModalOpen={this.state.modalOpen}
            closeModal={this.closeModal}
            telephoneInfo={this.state.contactInfoToUpdate}
            updateNumber={this.updateNumber}
            saveNumber={this.saveNumber}
            bluedogCaseRef={this.props.case.bluedogCaseRef}
            partyId={this.props.case.partyId}
            addNew={this.state.addNew}
          />
          <RemoveNumberModal
            isModalOpen={this.state.removeModalOpen}
            closeModal={this.closeRemoveModal}
            removeContactDetail={this.removeNumber}
            numberToRemove={this.state.numberToRemove}
          />
        </div>
      </Card>
    );
  }
}
const mapStateToProps = state => ({
  case: state.case.selectedCase,
  mi3dCase: state.case.mi3dCase,
  user: state.auth.user
});

const mapDispatchToProps = dispatch => ({
  updateBluedogCase: updatedCase => dispatch(updateBluedogCase(updatedCase)),
  updateMi3dCase: updatedCase => dispatch(updateMi3dCase(updatedCase))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InjuredPartyContactDetails);
