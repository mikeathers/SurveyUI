import React, { Component } from "react";
import { connect } from "react-redux";
import * as api from "api";

import { selectCase } from "helpers/case";

import { withErrorHandling } from "HOCs";

import {
  selectBluedogCase,
  selectSecondaryItem,
  updateMi3dCase
} from "actions";

import {
  Container,
  Row,
  Col,
  PageHeader,
  ErrorModal,
  LoadingModal
} from "components/Common";

import CaseList from "components/CMS/Rehab/Chases/CaseList/CaseList";

class Chases extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      chases: [],
      showErrorModal: false,
      errorMessage: null,
      showLoadingModal: false
    };

    this.selectCase = selectCase.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    this.getListOfCases();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  getListOfCases = async () => {
    const response = await api.getChases();
    if (response !== undefined && this._isMounted)
      this.setState({ chases: response.data });
    else this.props.showErrorModal();
  };

  closeModal = () => {
    this.setState({ showErrorModal: false, errorMessage: null });
  };

  render() {
    return (
      <div id="chasesContainer">
        <Container fluid>
          <PageHeader title="Outstanding Chases" id="chasesPageHeader" />
          <Row>
            <Col lg={12}>
              <CaseList
                chases={this.state.chases}
                selectCase={this.selectCase}
                id="chasesCaseList"
              />
            </Col>
          </Row>
          <ErrorModal
            id="chasesErrorModal"
            isModalOpen={this.state.showErrorModal}
            closeModal={this.closeModal}
            errorMessage={this.state.errorMessage}
          />
          <LoadingModal
            id="chasesLoadingModal"
            isModalOpen={this.state.showLoadingModal}
          />
        </Container>
      </div>
    );
  }
}
const mapDispatchToProps = dispatch => ({
  selectBluedogCase: selectedCase => dispatch(selectBluedogCase(selectedCase)),
  selectSecondaryItem: menuItem => dispatch(selectSecondaryItem(menuItem)),
  updateMi3dCase: selectedCase => dispatch(updateMi3dCase(selectedCase))
});

export default withErrorHandling(
  connect(
    null,
    mapDispatchToProps
  )(Chases)
);
