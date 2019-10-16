import React, { Component } from "react";
import { connect } from "react-redux";
import * as api from "api";

import {
  selectBluedogCase,
  updateMi3dCase,
  selectSecondaryItem,
  clearSelectedCases
} from "actions";

import { selectCase } from "helpers/case";
import { withErrorHandling } from "HOCs";

import CaseList from "components/CMS/Rehab/Cases/CaseList/CaseList";

import {
  Container,
  Row,
  Col,
  PageHeader,
  ErrorModal,
  LoadingModal
} from "components/Common";

import "./Cases.scss";

class Cases extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      cases: [],
      errorMessage: null,
      showErrorModal: false,
      showLoadingModal: false
    };
    this.selectCase = selectCase.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    this.getAllCases();
    this.props.clearSelectedCases();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  getAllCases = async () => {
    const response = await api.getAllCases();
    if (response !== undefined && this._isMounted)
      this.setState({ cases: response.data });
    else this.props.showErrorModal();
  };

  closeModal = () => {
    this.setState({ showErrorModal: false, errorMessage: null });
  };

  render() {
    const { cases } = this.state;
    return (
      <Container fluid>
        <PageHeader title="Current Cases" />
        <Row>
          <Col lg={12} md={12}>
            {cases !== undefined && (
              <CaseList cases={cases} selectCase={this.selectCase} />
            )}
          </Col>
        </Row>
        <ErrorModal
          isModalOpen={this.state.showErrorModal}
          errorMessage={this.state.errorMessage}
          closeModal={this.closeModal}
        />
        <LoadingModal isModalOpen={this.state.showLoadingModal} />
      </Container>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  updateMi3dCase: selectedCase => dispatch(updateMi3dCase(selectedCase)),
  selectSecondaryItem: menuItem => dispatch(selectSecondaryItem(menuItem)),
  selectBluedogCase: selectedCase => dispatch(selectBluedogCase(selectedCase)),
  clearSelectedCases: () => dispatch(clearSelectedCases())
});

export default withErrorHandling(
  connect(
    null,
    mapDispatchToProps
  )(Cases)
);
