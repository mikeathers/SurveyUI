import React, { Component } from "react";
import CaseAdminMenu from "components/CMS/Admin/CaseAdmin/CaseAdminMenu/CaseAdminMenu";
import StopCaseReasons from "components/CMS/Admin/CaseAdmin/StopCaseReasons/StopCaseReasons/StopCaseReasons";
import EmailTemplates from "components/CMS/Admin/CaseAdmin/Templates/EmailTemplates/EmailTemplates/EmailTemplates";
import LetterTemplates from "components/CMS/Admin/CaseAdmin/Templates/LetterTemplates/LetterTemplates/LetterTemplates";
import { Container, PageHeader } from "components/Common";

export default class CaseAdmin extends Component {
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
        return <LetterTemplates />;
      case "emailTemplates":
        return <EmailTemplates />;
      case "caseReasons":
        return <StopCaseReasons />;
      default:
        return null;
    }
  };

  render() {
    return (
      <Container fluid>
        <PageHeader title="Case Admin" />
        <CaseAdminMenu
          selected={this.state.selectedItem}
          selectItem={this.selectItem}
        />

        {this.renderComponent()}
      </Container>
    );
  }
}
