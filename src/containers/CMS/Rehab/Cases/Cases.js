import React, { Component } from "react";
import { connect } from "react-redux";
import {
  selectBluedogCase,
  updateMi3dCase,
  selectSecondaryItem
} from "actions";
import { checkForErrors } from "helpers/validation";
import * as api from "api";
import { Container, Row, Col, PageHeader, ErrorModal } from "components/Common";
import CaseList from "components/CMS/Rehab/Cases/CaseList/CaseList";
import "./Cases.scss";

class Cases extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      cases: [],
      showErrorModal: false,
      errorMessage: null
    };
    this.checkForErrors = checkForErrors.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    this.getAllCases();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  getAllCases = () => {
    api.getAllCases().then(res => {
      if (this._isMounted) {
        if (!this.checkForErrors(res, "modal")) {
          this.setState({ cases: res.data.result });
        }
      }
    });
  };

  getCase = caseId => {
    api.getCase(caseId).then(res => {
      if (!this.checkForErrors(res, "modal")) {
        this.props.updateMi3dCase(res.data.result);
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
      }
    });
  };

  selectCase = openedCase => {
    this.getCase(openedCase.caseId);
    this.getInjuredPartyDetails(openedCase.bluedogCaseRef);
  };

  render() {
    const { cases } = this.state;
    return (
      <Container fluid>
        <PageHeader title="Current Cases" />
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
  updateMi3dCase: selectedCase => dispatch(updateMi3dCase(selectedCase))
});
export default connect(
  null,
  mapDispatchToProps
)(Cases);
