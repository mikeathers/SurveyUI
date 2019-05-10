import React, { Component } from "react";
import * as api from "api";
import moment from "moment";
import {
  Card,
  Dropdown,
  FormGroup,
  FormRow,
  Label,
  Button,
  ButtonContainer,
  FlexBox,
  Modal,
  Message
} from "components/Common";

import "./EmailTemplatesList.scss";

export default class EmailTemplatesList extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      emailTemplates: [],
      selectedTemplateId: "",
      selectedTemplate: null,
      emailTemplatesForDropdown: [],
      removeModalOpen: false,
      showMessage: false,
      message: ""
    };
  }

  componentDidMount() {
    this._isMounted = true;
    api.getEmailTemplates().then(res => {
      if (this._isMounted) {
        this.setState({ emailTemplates: res.result }, () =>
          this.emailTemplatesForDropdown(res.result)
        );
      }
    });
  }

  componentWillReceiveProps({ clearForm }) {
    if (clearForm) {
      this.setState({ selectedTemplate: null, selectedTemplateId: "" });
      this.props.formCleared();
    }
    api.getEmailTemplates().then(res => {
      if (this._isMounted) {
        this.setState({ emailTemplates: res.result }, () =>
          this.emailTemplatesForDropdown(res.result)
        );
      }
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  emailTemplatesForDropdown = templates => {
    const emailTemplatesForDropdown = templates.map((template, key) => ({
      text: template.name,
      value: template.emailTemplateId,
      key
    }));
    this.setState({ emailTemplatesForDropdown });
  };

  handleChange = (e, { value }) => {
    const selectedTemplate = this.state.emailTemplates.find(
      m => m.emailTemplateId === value
    );
    this.props.getSelectedTemplate(selectedTemplate);
    this.setState({ selectedTemplateId: value, selectedTemplate });
  };

  clearSelectedTemplate = () => {
    this.setState({ selectedTemplateId: "" });
    this.props.clearSelectedTemplate();
  };

  removeEmailTemplate = id => {
    const removeEmailTemplateRequest = {
      emailTemplateId: id,
      actionedBy: this.props.username
    };
    api.removeEmailTemplate(removeEmailTemplateRequest).then(res => {
      if (this._isMounted) {
        if (!res.data.hasErrors) {
          this.setState({
            emailTemplates: res.data.result,
            removeModalOpen: false,
            selectedTemplate: null
          });
          this.emailTemplatesForDropdown(res.data.result);
          this.clearSelectedTemplate();

          this.setState({ showMessage: true });
          setTimeout(() => this.setState({ showMessage: false }), 3000);
        } else {
          this.setState({ showMessage: true });
          setTimeout(() => this.setState({ showMessage: false }), 6000);
          this.setState({
            removeModalOpen: false,
            message: res.data.errors[0].errorMessage
          });
        }
      }
    });
  };

  render() {
    const { selectedTemplate } = this.state;
    return (
      <Card title="Manage Email Templates">
        <FormRow>
          <FormGroup>
            <Label text="Email Templates:" width="100" />
            <FlexBox>
              <Dropdown
                width="200"
                selection
                options={this.state.emailTemplatesForDropdown}
                placeholder="Select a template.."
                onChange={this.handleChange}
                value={this.state.selectedTemplateId}
              />

              <Button
                content="Clear"
                marginleft="10"
                secondary
                onClick={this.clearSelectedTemplate}
              />
            </FlexBox>
          </FormGroup>
        </FormRow>
        {this.state.selectedTemplate !== null && (
          <div>
            <FormRow marginTop="35">
              <FormGroup flexBasis="30">
                <Label text="Template Name:" width="100" />
                <Label text={selectedTemplate.name} thin width="100" />
              </FormGroup>
              <FormGroup flexBasis="30" width="100">
                <Label text="Associated Letter:" width="100" />
                <Label
                  text={selectedTemplate.letterTemplate.name}
                  thin
                  width="100"
                />
              </FormGroup>
              <FormGroup flexBasis="30">
                <Label text="Send To:" width="100" />
                <Label text={selectedTemplate.sendTo} thin width="100" />
              </FormGroup>
            </FormRow>
            <FormRow marginTop="35">
              <FormGroup flexBasis="30">
                <Label text="Created By:" width="100" />
                <Label text={selectedTemplate.createdBy} thin width="100" />
              </FormGroup>
              <FormGroup flexBasis="30">
                <Label text="Last Updated By:" width="100" />
                <Label text={selectedTemplate.lastUpdatedBy} thin width="100" />
              </FormGroup>
              <FormGroup flexBasis="30">
                <Label text="Last Updated On:" width="100" />
                <Label
                  text={moment(selectedTemplate.lastUpdatedOn).format(
                    "DD/MM/YYYY hh:mm A"
                  )}
                  thin
                  width="100"
                />
              </FormGroup>
            </FormRow>
            <ButtonContainer
              justifyContent={
                this.state.showMessage ? "space-between" : "flex-end"
              }
              marginTop="35"
            >
              <Message
                show={this.state.showMessage}
                error={this.state.message !== ""}
                message={this.state.message}
                width="60"
              />
              <Button
                content="Remove Email Template"
                secondary
                onClick={() => this.setState({ removeModalOpen: true })}
              />
            </ButtonContainer>
          </div>
        )}
        <Modal
          isModalOpen={this.state.removeModalOpen}
          title="Remove Email Template"
          message="Are you sure you want to remove this template?"
          item={
            this.state.selectedTemplate !== null
              ? this.state.selectedTemplate.name
              : ""
          }
        >
          <ButtonContainer justifyContent="flex-end">
            <Button
              content="Close"
              secondary
              onClick={() => this.setState({ removeModalOpen: false })}
            />
            <Button
              content="Remove"
              type="danger"
              onClick={() =>
                this.removeEmailTemplate(this.state.selectedTemplateId)
              }
            />
          </ButtonContainer>
        </Modal>
      </Card>
    );
  }
}
