import React, { Component } from "react";
import { connect } from "react-redux";
import { Container, Row, Col, PageHeader, PageAction } from "components/Common";
import InjuredPartyDetails from "components/CMS/Rehab/Case/InjuredPartyDetails/InjuredPartyDetails";
import InjuredPartyContactDetails from "components/CMS/Rehab/Case/InjuredPartyContactDetails/InjuredPartyContactDetails";
import CaseDocuments from "components/CMS/Rehab/Case/CaseDocuments/CaseDocuments";
import AvailableSurveys from "components/CMS/Rehab/Case/AvailableSurveys/AvailableSurveys";
import CaseNotes from "components/CMS/Rehab/Case/CaseNotes/CaseNotes";
import CallBacks from "components/CMS/Rehab/Case/CallBacks/CallBacks";
import Chases from "components/CMS/Rehab/Case/Chases/Chases";
import CaseModal from "components/CMS/Rehab/Case/CaseModal/CaseModal";
import CaseDetails from "components/CMS/Rehab/Case/CaseDetails/CaseDetails";
import CaseActivities from "components/CMS/Rehab/Case/CaseActivities/CaseActivities";

class Case extends Component {
  constructor(props) {
    super(props);
    this.state = {
      caseModalOpen: false,
      caseModalButtonContent: "",
      caseModalTitle: "",
      caseModalReasonText: ""
    };
  }

  selectSurvey = path => {
    this.props.history.push(path);
  };

  openHoldModal = () => {
    this.setState({
      caseModalOpen: true,
      caseModalButtonContent: "Hold Case",
      caseModalTitle: "Put the case on hold",
      caseModalReasonText: "Reason for putting the case on hold:"
    });
  };

  openCloseModal = () => {
    this.setState({
      caseModalOpen: true,
      caseModalButtonContent: "Close Case",
      caseModalTitle: "Close the case",
      caseModalReasonText: "Reason for closing the case:"
    });
  };

  render() {
    return this.props.case.bluedogCaseRef !== undefined ? (
      <Container fluid>
        <PageHeader title={`Case Ref - ${this.props.case.bluedogCaseRef}`}>
          <PageAction
            actionName="Hold Case"
            triggerAction={this.openHoldModal}
          />
          <PageAction
            actionName="Close Case"
            triggerAction={this.openCloseModal}
          />
        </PageHeader>
        <Row />
        <Row>
          <Col lg={6} md={12} sm={12}>
            <Row>
              <Col sm={12}>
                <InjuredPartyDetails />
              </Col>
            </Row>

            <Row>
              <Col sm={12}>
                <AvailableSurveys
                  bluedogCaseRef={this.props.case.bluedogCaseRef}
                  selectSurvey={this.selectSurvey}
                  mi3dCase={this.props.mi3dCase}
                />
              </Col>
            </Row>
            <Row>
              <Col sm={12}>
                <CaseDocuments
                  documents={
                    this.props.mi3dCase !== null
                      ? this.props.mi3dCase.caseDocuments
                      : null
                  }
                />
              </Col>
            </Row>

            <Row>
              <Col sm={12}>
                <CaseActivities />
              </Col>
            </Row>
          </Col>

          {/* RIGHT SIDE  */}
          <Col lg={6} md={12} sm={12}>
            <Row>
              <Col sm={12}>
                <CaseDetails
                  case={this.props.case}
                  mi3dCase={this.props.mi3dCase}
                />
              </Col>
            </Row>
            <Row>
              <Col sm={12}>
                <InjuredPartyContactDetails />
              </Col>
            </Row>

            <Row>
              <Col sm={12}>
                <CallBacks />
              </Col>
            </Row>
            <Row>
              <Col sm={12}>
                <Chases />
              </Col>
            </Row>
            <Row>
              <Col sm={12}>
                <CaseNotes />
              </Col>
            </Row>
          </Col>
        </Row>
        <CaseModal
          isModalOpen={this.state.caseModalOpen}
          buttonContent={this.state.caseModalButtonContent}
          title={this.state.caseModalTitle}
          closeModal={() => this.setState({ caseModalOpen: false })}
          reasonText={this.state.caseModalReasonText}
        />
      </Container>
    ) : (
      <div>
        <p>Case Not Found</p>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  case: state.case.selectedCase,
  mi3dCase: state.case.mi3dCase
});

export default connect(mapStateToProps)(Case);
