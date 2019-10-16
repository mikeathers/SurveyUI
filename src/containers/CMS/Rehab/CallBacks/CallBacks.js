import React, { Component } from "react";
import * as api from "api";
import { connect } from "react-redux";

import {
  updateMi3dCase,
  selectBluedogCase,
  selectSecondaryItem
} from "actions";

import { selectCase } from "helpers/case";

import { withErrorHandling } from "HOCs";

import {
  Col,
  Row,
  Container,
  PageHeader,
  ErrorModal,
  LoadingModal
} from "components/Common";

import CaseList from "components/CMS/Rehab/CallBacks/CaseList/CaseList";

import "./CallBacks.scss";

export class CallBacks extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      callbacks: [],
      errorMessage: null,
      showErrorModal: false,
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
    const response = await api.getCallBacks();
    if (response !== undefined && this._isMounted)
      this.setState({ callbacks: response.data });
    else this.props.showErrorModal();
  };

  closeModal = () => {
    this.setState({ showErrorModal: false, errorMessage: null });
  };

  render() {
    return (
      <div id="callBacksContainer">
        <Container fluid>
          <PageHeader title="Outstanding Call Backs" id="callBacksPageHeader" />
          <Row>
            <Col lg={12}>
              <CaseList
                id="callBacksCaseList"
                selectCase={this.selectCase}
                callbacks={this.state.callbacks}
              />
            </Col>
          </Row>
          <ErrorModal
            id="callBacksErrorModal"
            errorMessage={this.state.errorMessage}
            isModalOpen={this.state.showErrorModal}
            closeModal={this.closeModal}
          />
          <LoadingModal
            id="callBacksLoadingModal"
            isModalOpen={this.state.showLoadingModal}
          />
        </Container>
      </div>
    );
  }
}
const mapDispatchToProps = dispatch => ({
  updateMi3dCase: selectedCase => dispatch(updateMi3dCase(selectedCase)),
  selectSecondaryItem: menuItem => dispatch(selectSecondaryItem(menuItem)),
  selectBluedogCase: selectedCase => dispatch(selectBluedogCase(selectedCase))
});

export default withErrorHandling(
  connect(
    null,
    mapDispatchToProps
  )(CallBacks)
);
