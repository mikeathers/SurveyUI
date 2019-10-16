import React, { Component } from "react";
import * as api from "api";
import { connect } from "react-redux";
import { isObjectValid } from "helpers/validation";
import {withErrorHandling} from "HOCs";

import {
  updateMi3dCase,
  updateMi3dCaseId,
  selectBluedogCase,
  selectSecondaryItem,
  clearSelectedCases
} from "actions";

import {
  Row,
  Col,
  Modal,
  Button,
  Container,
  PageHeader,
  LoadingModal,
  ButtonContainer
} from "components/Common";

import CaseList from "components/CMS/Rehab/NewCases/CaseList/CaseList";

import "./NewCases.scss";

class NewCases extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cases: [],
      hasErrors: false,
      errorMessage: null,
      showErrorModal: false,
      showLoadingModal: false,
      showInvalidCaseModal: false
    };
  }

  componentDidMount() {
    this._isMounted = true;
    this.getClinicianCases();
    this.props.clearSelectedCases();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  hideLoadingModal = () => {
    this.setState({ showLoadingModal: false });
  };

  getClinicianCases = async () => {
    const response = await api.getClinicianCases();
    if (response !== undefined) {
      if (this._isMounted && response.status === 200)
        this.setState({ cases: response.data });
      else this.props.showErrorModal();
    } else this.props.showErrorModal();
  };

  getInjuredPartyDetails = async openedCase => {
    const response = await api.getInjuredPartyDetails(
      openedCase.bluedogCaseRef
    );
    if (response !== undefined) {
      if (response.status === 200) {
        this.props.selectBluedogCase(response.data);
        return this.caseToCreate(openedCase, response.data);
      } else {
        this.props.showErrorModal();
        this.hideLoadingModal();
        return null;
      }
    } else {
      this.props.showErrorModal();
      this.hideLoadingModal();
    }
  };

  caseToCreate = (openedCase, injuredParty) => ({
    ...openedCase,
    firstName: injuredParty.firstName,
    lastName: injuredParty.lastName,
    instructingPartyName: injuredParty.instructingParty.name
  });

  createCaseIfDoesntExist = async caseToCreate => {
    const openCaseResult = await api.openCase(caseToCreate);
    if (openCaseResult !== undefined) {
      const caseId = openCaseResult.data.caseId;
      this.props.updateMi3dCaseId(caseId);
      return caseId;
    } else {
      this.props.showErrorModal();
      this.hideLoadingModal();
    }
  };

  getCase = async caseId => {
    const getCaseResult = await api.getCase(caseId);
    if (getCaseResult !== undefined)
      this.props.updateMi3dCase(getCaseResult.data);
    else {
      this.props.showErrorModal();
      this.hideLoadingModal();
    }
  };

  updateBluedogCaseStatus = async bluedogCaseRef => {
    await api.updateBluedogCaseStatus(bluedogCaseRef);
  };

  selectCase = async openedCase => {
    if (this.caseHasValidDetails(openedCase)) {
      const injuredPartyDetails = await this.getInjuredPartyDetails(openedCase);
      if (
        injuredPartyDetails !== null &&
        this.caseHasValidDetails(injuredPartyDetails)
      ) {
        this.showLoadingModal();
        if (isObjectValid(injuredPartyDetails)) {
          const caseId = await this.createCaseIfDoesntExist(
            injuredPartyDetails
          );
          if (caseId !== undefined) {
            await this.getCase(caseId);
            this.updateBluedogCaseStatus(openedCase.bluedogCaseRef);
            this.hideErrorMessage();
            this.goToCase(openedCase.bluedogCaseRef);
          } else {
            this.props.showErrorModal();
            this.hideLoadingModal();
          }
        } else {
          this.showErrorMessage(
            "The Bluedog case does not have all the relevant fields for a case to be created."
          );
        }
      } else this.showInvalidCaseModal();
    } else this.showInvalidCaseModal();
  };

  caseHasValidDetails = openedCase => {
    return (
      openedCase.instructingParty !== null &&
      (openedCase.instructingParty !== "" && openedCase.firstName !== null) &&
      (openedCase.firstName !== "" && openedCase.lastName !== null) &&
      openedCase.lastName !== ""
    );
  };

  goToCase = bluedogCaseRef => {
    this.props.selectSecondaryItem("Cases");
    this.props.history.push(`/cms/rehab/case/${bluedogCaseRef}`);
  };

  showInvalidCaseModal = () => {
    this.setState({ showInvalidCaseModal: true });
  };

  showLoadingModal = () => {
    this.setState({ showLoadingModal: true });
  };

  showErrorMessage = message => {
    this.setState({
      showErrorModal: true,
      errorMessage: message
    });
  };

  hideErrorMessage = () => {
    this.setState({
      showErrorModal: false,
      errorMessage: null
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
        <LoadingModal isModalOpen={this.state.showLoadingModal} />
        <Modal
          isModalOpen={this.state.showInvalidCaseModal}
          title="Invalid Case Details"
          message="This case has invalid details and cannot be worked on"
        >
          <ButtonContainer justifyContent="flex-end">
            <Button
              content="Close"
              secondary
              onClick={() => this.setState({ showInvalidCaseModal: false })}
            />
          </ButtonContainer>
        </Modal>
      </Container>
    );
  }
}
const mapDispatchToProps = dispatch => ({
  updateMi3dCaseId: caseId => dispatch(updateMi3dCaseId(caseId)),
  updateMi3dCase: selectedCase => dispatch(updateMi3dCase(selectedCase)),
  selectSecondaryItem: menuItem => dispatch(selectSecondaryItem(menuItem)),
  selectBluedogCase: selectedCase => dispatch(selectBluedogCase(selectedCase)),
  clearSelectedCases: () => dispatch(clearSelectedCases())
});

export default withErrorHandling(
  connect(
    null,
    mapDispatchToProps
  )(NewCases)
);
