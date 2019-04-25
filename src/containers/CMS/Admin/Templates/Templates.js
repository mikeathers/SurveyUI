import React, { Component } from "react";

import { Container } from "components/Common";

export default class Templates extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTemplate: null,
      emailTemplates: [],
      letterTemplates: [],
      clearForm: false
    };
  }
  getSelectedTemplate = selectedTemplate => {
    this.setState({ selectedTemplate });
  };

  getEmailTemplates = emailTemplates => {
    this.setState({ emailTemplates });
  };

  clearSelectedTemplate = () => {
    this.setState({ selectedTemplate: null, clearForm: true });
  };

  formCleared = () => {
    this.setState({ clearForm: false });
  };

  getLetterTemplates = letterTemplates => {
    this.setState({ letterTemplates });
  };

  render() {
    return (
      <Container fluid>
        {/* <Row>
          <Col lg={6} md={6} sm={12}>
            <Row>
              <Col sm={12}>
                <AddDocumentTemplate
                  getLetterTemplates={this.getLetterTemplates}
                />
              </Col>
            </Row>
            <Row>
              <Col sm={12}>
                <EmailTemplateBuilder
                  selectedTemplate={this.state.selectedTemplate}
                  getEmailTemplates={this.getEmailTemplates}
                  clearSelectedTemplate={this.clearSelectedTemplate}
                  clearForm={this.state.clearForm}
                  letterTemplates={this.state.letterTemplates}
                />
              </Col>
            </Row>
          </Col>
          <Col lg={6} md={6} sm={12}>
            <Row>
              <Col sm={12}>
                <ManageDocumentTemplate
                  letterTemplates={this.state.letterTemplates}
                  getLetterTemplates={this.getLetterTemplates}
                />
              </Col>
            </Row>
            <Row>
              <Col sm={12}>
                <EmailTemplates
                  getSelectedTemplate={this.getSelectedTemplate}
                  emailTemplates={this.state.emailTemplates}
                  clearSelectedTemplate={this.clearSelectedTemplate}
                  clearForm={this.state.clearForm}
                  formCleared={this.formCleared}
                />
              </Col>
            </Row>
          </Col>
        </Row> */}
      </Container>
    );
  }
}
