import React, { Component } from "react";
import _ from "lodash";
import * as api from "api";
import {withErrorHandling} from "HOCs";
import EmailTemplatesList from "../EmailTemplatesList/EmailTemplatesList";
import EmailTemplateBuilder from "../EmailTemplateBuilder/EmailTemplateBuilder";

import { Row, Col } from "components/Common";

import "./EmailTemplates.scss";

class EmailTemplates extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailTemplates: [],
      emailTemplatesForDropdown: [],
      letterTemplates: [],
      letterTemplatesForDropdown: [],
      templateStrings: [],
      selectedTemplate: null
    };
  }

  componentDidMount() {
    this.getEmailTemplates();
    this.getLetterTemplates();
    this.getTemplateStrings();
  }

  setSelectedTemplate = selectedTemplate => {
    this.setState({ selectedTemplate });
  };

  setEmailTemplates = emailTemplates => {
    this.setState({ emailTemplates });
  };

  setLetterTemplates = letterTemplates => {
    this.setState({ letterTemplates });
  };

  getEmailTemplates = async () => {
    const response = await api.getEmailTemplates();
    if (response !== undefined) {
      const emailTemplates = _.orderBy(response.data, "name");
      this.setState({ emailTemplates }, () =>
        this.mapEmailTemplatesForDropdown(emailTemplates)
      );
    } else this.props.showErrorModal();
  };

  getTemplateStrings = async () => {
    const response = await api.getTemplateStrings();
    if (response !== undefined) {
      const templateStrings = response.data.map(string => ({
        text: `{${string}}}`,
        value: `{${string}}}`
      }));
      this.setState({ templateStrings });
    } else this.props.showErrorModal();
  };

  getLetterTemplates = async () => {
    const response = await api.getLetterTemplates();
    if (response !== undefined) {
      if (response.status === 200) {
        const letterTemplates = _.orderBy(response.data, "name");
        this.mapLetterTemplatesForDropdown(letterTemplates);
      } else this.props.showErrorModal();
    } else this.props.showErrorModal();
  };

  mapLetterTemplatesForDropdown = letterTemplates => {
    const letterTemplatesForDropdown = letterTemplates.map(template => ({
      text: template.name,
      value: template.letterTemplateId
    }));
    this.setState({ letterTemplatesForDropdown });
  };

  mapEmailTemplatesForDropdown = templates => {
    if (templates !== undefined) {
      const emailTemplatesForDropdown = templates.map((template, key) => ({
        text: template.name,
        value: template.emailTemplateId,
        key
      }));
      this.setState({
        emailTemplatesForDropdown: _.orderBy(emailTemplatesForDropdown, "text")
      });
    }
  };

  clearSelectedTemplate = () => {
    this.setState({ selectedTemplate: null });
  };

  removeEmailTemplate = async emailTemplateId => {
    const removeEmailTemplateRequest = {
      emailTemplateId,
      actionedBy: this.props.username
    };
    const response = await api.removeEmailTemplate(removeEmailTemplateRequest);
    if (response !== undefined) {
      this.setState({ emailTemplates: response.data });
      this.mapEmailTemplatesForDropdown(response.data);
      setTimeout(() => this.clearSelectedTemplate(), 3000);
      return response;
    } else return response;
  };

  saveEmailTemplate = async emailTemplate => {
    const response = await api.saveEmailTemplate(emailTemplate);
    if (response !== undefined) {
      this.setState({ emailTemplates: response.data });
      this.mapEmailTemplatesForDropdown(response.data);
      setTimeout(() => this.clearSelectedTemplate(), 3000);
      return response;
    } else return response;
  };

  render() {
    return (
      <Row id="emailTemplates">
        <Col lg={6} md={6} sm={12}>
          <Row>
            <Col sm={12}>
              <EmailTemplateBuilder
                id="emailTemplateBuilder"
                selectedTemplate={this.state.selectedTemplate}
                clearSelectedTemplate={this.clearSelectedTemplate}
                username={this.props.username}
                bluedogCase={this.props.bluedogCase}
                emailTemplates={this.state.emailTemplates}
                emailTemplatesForDropdown={this.state.emailTemplatesForDropdown}
                letterTemplates={this.state.letterTemplates}
                letterTemplatesForDropdown={
                  this.state.letterTemplatesForDropdown
                }
                templateStrings={this.state.templateStrings}
                saveEmailTemplate={this.saveEmailTemplate}
              />
            </Col>
          </Row>
        </Col>
        <Col lg={6} md={6} sm={12}>
          <Row>
            <Col sm={12}>
              <EmailTemplatesList
                id="emailTemplatesList"
                getSelectedTemplate={this.setSelectedTemplate}
                emailTemplates={this.state.emailTemplates}
                emailTemplatesForDropdown={this.state.emailTemplatesForDropdown}
                clearSelectedTemplate={this.clearSelectedTemplate}
                selectedTemplate={this.state.selectedTemplate}
                username={this.props.username}
                removeEmailTemplate={this.removeEmailTemplate}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}
export default withErrorHandling(EmailTemplates);
