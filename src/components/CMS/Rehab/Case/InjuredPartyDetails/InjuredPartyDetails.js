import React, { Component } from "react";
import { connect } from "react-redux";
import { updateBluedogCase, updateMi3dCase } from "actions";
import * as api from "api";

import { Card, Message } from "components/Common";
import DefaultDetails from "./DefaultDetails";
import UpdateDetails from "./UpdateDetails";

class InjuredPartyDetails extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      updating: false,
      showMessage: false,
      message: "",
      errorMessage: false
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

  updateDetails = details => {
    const defaultDetailsAndUpdatedDetails = {
      ...this.props.case,
      ...details,
      caseId: this.props.mi3dCase.caseId,
      actionedBy: this.props.user.name
    };
    api.updateCase(defaultDetailsAndUpdatedDetails).then(res => {
      if (res.status === 200) {
        this.props.updateMi3dCase(res.data);
      }
    });
    api.updateInjuredPartyDetails(defaultDetailsAndUpdatedDetails).then(res => {
      if (res.status === 200) {
        console.log(res);
        this.props.updateBluedogCase(res.data);
        if (this._isMounted) {
          this.setState({
            showMessage: true,
            message: "Injured party details updated successfully.",
            errorMessage: false
          });
          setTimeout(() => this.setState({ showMessage: false }), 3000);
          this.switchForms();
        }
      } else {
        if (this._isMounted)
          this.setState({
            showMessage: true,
            message: res.data,
            errorMessage: true
          });
      }
    });
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
            justifyContent="flex-end"
            marginTop={-25}
            marginRight={110}
          />
        </Card>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InjuredPartyDetails);
