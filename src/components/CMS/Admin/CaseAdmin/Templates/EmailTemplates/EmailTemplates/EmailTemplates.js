import React, { Component } from "react";
import { connect } from "react-redux";
import EmailTemplatesList from "../EmailTemplatesList/EmailTemplatesList";
import EmailTemplateBuilder from "../EmailTemplateBuilder/EmailTemplateBuilder";

import { Row, Col } from "components/Common";

import "./EmailTemplates.scss";

class EmailTemplates extends Component {
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
      <Row>
        <Col lg={6} md={6} sm={12}>
          <Row>
            <Col sm={12}>
              <EmailTemplateBuilder
                selectedTemplate={this.state.selectedTemplate}
                getEmailTemplates={this.getEmailTemplates}
                clearSelectedTemplate={this.clearSelectedTemplate}
                clearForm={this.state.clearForm}
                letterTemplates={this.state.letterTemplates}
                username={this.props.username}
                bluedogCase={this.props.bluedogCase}
              />
            </Col>
          </Row>
        </Col>
        <Col lg={6} md={6} sm={12}>
          <Row>
            <Col sm={12}>
              <EmailTemplatesList
                getSelectedTemplate={this.getSelectedTemplate}
                emailTemplates={this.state.emailTemplates}
                clearSelectedTemplate={this.clearSelectedTemplate}
                clearForm={this.state.clearForm}
                formCleared={this.formCleared}
                username={this.props.username}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = state => ({
  bluedogCase: state.case.selectedCase,
  username: state.auth.user.name
});

export default connect(mapStateToProps)(EmailTemplates);
