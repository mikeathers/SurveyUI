import React, { Component } from "react";
import { connect } from "react-redux";
import CaseAdminMenu from "components/CMS/Admin/CaseAdmin/CaseAdminMenu/CaseAdminMenu";
import StopCaseReasons from "components/CMS/Admin/CaseAdmin/StopCaseReasons/StopCaseReasons/StopCaseReasons";
import EmailTemplates from "components/CMS/Admin/CaseAdmin/Templates/EmailTemplates/EmailTemplates/EmailTemplates";
import LetterTemplates from "components/CMS/Admin/CaseAdmin/Templates/LetterTemplates/LetterTemplates/LetterTemplates";
import { Container, PageHeader } from "components/Common";

class CaseAdmin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stopCaseReasonsAdded: false,
      selectedItem: "letterTemplates"
    };
  }

  stopCaseReasonsAdded = () => {
    this.setState({ stopCaseReasonsAdded: true });
  };

  selectItem = item => {
    this.setState({ selectedItem: item });
  };

  renderComponent = () => {
    switch (this.state.selectedItem) {
      case "letterTemplates":
        return (
          <LetterTemplates
            id="letterTemplates"
            username={this.props.username}
          />
        );
      case "emailTemplates":
        return (
          <EmailTemplates
            id="emailTemplates"
            username={this.props.username}
            bluedogCase={this.props.bluedogCase}
          />
        );
      case "stopCaseReasons":
        return (
          <StopCaseReasons
            id="stopCaseReasons"
            username={this.props.username}
          />
        );
      default:
        return null;
    }
  };

  render() {
    return (
      <Container fluid id="caseAdmin">
        <PageHeader title="Case Admin" />
        <CaseAdminMenu
          id="caseAdminMenu"
          selectItem={this.selectItem}
          selected={this.state.selectedItem}
        />
        {this.renderComponent()}
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  username: state.auth.user.name,
  bluedogCase: state.case.selectedCase
});

export default connect(mapStateToProps)(CaseAdmin);
