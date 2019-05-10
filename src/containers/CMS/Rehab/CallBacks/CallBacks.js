import React, { Component } from "react";
import * as api from "api";
import { connect } from "react-redux";
import {
  selectBluedogCase,
  selectSecondaryItem,
  updateMi3dCase
} from "actions";
import { checkForErrors } from "helpers/validation";

import { Container, Row, Col, PageHeader, ErrorModal } from "components/Common";

import CaseList from "components/CMS/Rehab/CallBacks/CaseList/CaseList";

import "./CallBacks.scss";

class CallBacks extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      callbacks: [],
      showErrorModal: false,
      errorMessage: null
    };
    this.checkForErrors = checkForErrors.bind(this);
  }
  componentDidMount() {
    this._isMounted = true;
    api.getCallBacks().then(res => {
      if (this._isMounted) {
        if (!this.checkForErrors(res, "modal")) {
          this.setState({ callbacks: res.data.result });
        } else {
          this.setState({ showErrorModal: true });
        }
      }
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  getCase = caseId => {
    return api.getCase(caseId).then(res => {
      if (!this.checkForErrors(res, "modal")) {
        this.props.updateMi3dCase(res.data.result);
      } else {
        this.setState({ showErrorModal: true });
      }
    });
  };

  getInjuredPartyDetails = bluedogCaseRef => {
    api.getInjuredPartyDetails(bluedogCaseRef).then(returnedCase => {
      if (!this.checkForErrors(returnedCase, "modal")) {
        this.props.selectBluedogCase(returnedCase);
        this.props.selectSecondaryItem("Cases");
        this.props.history.push(
          `/cms/rehab/case/${returnedCase.bluedogCaseRef}`
        );
      } else {
        this.setState({ showErrorModal: true });
      }
    });
  };

  selectCase = openedCase => {
    this.getCase(openedCase.caseId);
    this.getInjuredPartyDetails(openedCase.bluedogCaseRef);
  };

  render() {
    return (
      <Container fluid>
        <PageHeader title="Outstanding Call Backs" />
        <Row>
          <Col lg={12}>
            <CaseList
              callbacks={this.state.callbacks}
              selectCase={this.selectCase}
            />
          </Col>
        </Row>
        <ErrorModal
          isModalOpen={this.state.showErrorModal}
          closeModal={() =>
            this.setState({ showErrorModal: false, errorMessage: null })
          }
          errorMessage={this.state.errorMessage}
        />
      </Container>
    );
  }
}
const mapDispatchToProps = dispatch => ({
  selectBluedogCase: selectedCase => dispatch(selectBluedogCase(selectedCase)),
  selectSecondaryItem: menuItem => dispatch(selectSecondaryItem(menuItem)),
  updateMi3dCase: selectedCase => dispatch(updateMi3dCase(selectedCase))
});

export default connect(
  null,
  mapDispatchToProps
)(CallBacks);
