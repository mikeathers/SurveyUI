import React, { Component } from "react";
import { connect } from "react-redux";
import {
  selectBluedogCase,
  selectSecondaryItem,
  updateMi3dCase,
  updateMi3dCaseId
} from "actions";
import * as api from "api";
import { checkForErrors, isObjectValid } from "helpers/validation";

import { Container, Row, Col, PageHeader, ErrorModal } from "components/Common";

import CaseList from "components/CMS/Rehab/NewCases/CaseList/CaseList";

import "./NewCases.scss";

class NewCases extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      cases: [],
      showErrorModal: false,
      hasErrors: false,
      errorMessage: null
    };
    this.checkForErrors = checkForErrors.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    this.getClinicianCases();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  getClinicianCases = () => {
    api.getClinicianCases().then(res => {
      if (this._isMounted) {
        if (!this.checkForErrors(res, "modal")) {
          this.setState({ cases: res });
        }
      }
    });
  };

  getInjuredPartyDetails = openedCase => {
    return api
      .getInjuredPartyDetails(openedCase.bluedogCaseRef)
      .then(returnedCase => {
        this.props.selectBluedogCase(returnedCase);
        if (!this.checkForErrors(returnedCase, "modal")) {
          const caseToCreate = {
            ...openedCase,
            firstName: returnedCase.firstName,
            lastName: returnedCase.lastName,
            instructingPartyName: returnedCase.instructingPartyName
          };
          return caseToCreate;
        }
      });
  };

  createCaseIfDoesntExist = caseToCreate => {
    console.log(caseToCreate);
    return api.openCase(caseToCreate).then(res => {
      console.log(res);
      if (!this.checkForErrors(res, "modal")) {
        const caseId = res.data.result.caseId;
        this.props.updateMi3dCaseId(caseId);
        return caseId;
      }
    });
  };

  getCase = caseId => {
    api.getCase(caseId).then(res => {
      console.log(res);
      if (!this.checkForErrors(res, "modal")) {
        this.props.updateMi3dCase(res.data.result);
      }
    });
  };

  updateBluedogCaseStatus = bluedogCaseRef => {
    api.updateBluedogCaseStatus(bluedogCaseRef);
  };

  selectCase = openedCase => {
    this.getInjuredPartyDetails(openedCase).then(caseToCreate => {
      console.log(caseToCreate);
      if (!isObjectValid(caseToCreate))
        this.setState({
          showErrorModal: true,
          errorMessage:
            "The Bluedog case does not have all the relevant fields for a case to be created."
        });
      else {
        this.createCaseIfDoesntExist(caseToCreate).then(caseId => {
          this.getCase(caseId);
          this.updateBluedogCaseStatus(openedCase.bluedogCaseRef);
          this.props.selectSecondaryItem("Cases");
          this.props.history.push(
            `/cms/rehab/case/${openedCase.bluedogCaseRef}`
          );
        });
        this.setState({
          showErrorModal: false,
          errorMessage: null
        });
      }
    });
  };

  render() {
    const { cases } = this.state;
    return (
      <Container fluid>
        <PageHeader title="New Clinican Cases" />
        <Row>
          <Col lg={12} md={12}>
            <CaseList cases={cases} selectCase={this.selectCase} />
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
  updateMi3dCase: selectedCase => dispatch(updateMi3dCase(selectedCase)),
  updateMi3dCaseId: caseId => dispatch(updateMi3dCaseId(caseId))
});

export default connect(
  null,
  mapDispatchToProps
)(NewCases);
