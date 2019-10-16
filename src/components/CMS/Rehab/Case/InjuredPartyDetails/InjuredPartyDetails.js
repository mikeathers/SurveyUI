import React, { Component } from "react";
import * as api from "api";
import { connect } from "react-redux";
import { updateBluedogCase, updateMi3dCase } from "actions";
import {withErrorHandling} from "HOCs";
import DefaultDetails from "./DefaultDetails";
import UpdateDetails from "./UpdateDetails";
import { Card, Message, ErrorModal } from "components/Common";

class InjuredPartyDetails extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      updating: false,
      showMessage: false,
      errorMessage: false,
      showErrorModal: false
    };
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  switchForms = () => {
    this.setState({ updating: !this.state.updating });
  };

  defaultDetailsAndUpdatedDetails = details => ({
    ...this.props.case,
    ...details,
    caseId: this.props.mi3dCase.caseId,
    actionedBy: this.props.user.name
  });

  updateDetails = async details => {
    const response = await api.updateCase(
      this.defaultDetailsAndUpdatedDetails(details)
    );
    if (response !== undefined) {
      if (response.status === 200) {
        this.props.updateMi3dCase(response.data.mi3DCase);
        this.props.updateBluedogCase(response.data.bluedogCase);
        this.showSuccessMessage("Injured party details updated successfully");
        this.switchForms();
      } else this.showErrorMessage(response.data[0].errorMessage);
    } else this.props.showErrorModal();
  };

  showSuccessMessage = message => {
    this.setState({
      message,
      showMessage: true,
      errorMessage: false
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
      <div>
        <Card title="Injured Party Details" collapse={false}>
          {!this.state.updating ? (
            <DefaultDetails
              case={this.props.case}
              mi3dCase={this.props.mi3dCase}
              switchForms={this.switchForms}
            />
          ) : (
            <UpdateDetails
              case={this.props.case}
              switchForms={this.switchForms}
              updateDetails={this.updateDetails}
            />
          )}

          <Message
            show={this.state.showMessage}
            error={this.state.errorMessage}
            message={this.state.message}
            justifyContent="flex-start"
            marginTop={-25}
          />
        </Card>
        <ErrorModal
          isModalOpen={this.state.showErrorModal}
          closeModal={() =>
            this.setState({ showErrorModal: false, errorMessage: null })
          }
          errorMessage={"Please try again later"}
        />
      </div>
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

export default withErrorHandling(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(InjuredPartyDetails)
);
