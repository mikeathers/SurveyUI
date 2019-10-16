import React, { Component } from "react";
import EmailTemplateInfo from "./EmailTemplateInfo";
import RemoveEmailTemplateModal from "./RemoveEmailTemplateModal";
import {
  Card,
  Dropdown,
  FormGroup,
  FormRow,
  Label,
  Button,
  ButtonContainer,
  Message,
  FlexBox
} from "components/Common";

import "./EmailTemplatesList.scss";

export default class EmailTemplatesList extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      selectedTemplateId: "",
      selectedTemplate: null,
      removeModalOpen: false,
      showMessage: false,
      errorMessage: false,
      message: "",
      emailTemplates:
        props.emailTemplates !== undefined ? props.emailTemplates : [],
      emailTemplatesForDropdown:
        props.emailTemplatesForDropdown !== undefined
          ? props.emailTemplatesForDropdown
          : []
    };
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentWillReceiveProps({
    emailTemplates,
    emailTemplatesForDropdown,
    selectedTemplate
  }) {
    if (emailTemplates !== undefined) this.setState({ emailTemplates });
    if (emailTemplatesForDropdown !== undefined)
      this.setState({ emailTemplatesForDropdown });
    if (selectedTemplate !== null) this.setState({ selectedTemplate });
    else this.setState({ selectedTemplateId: "", selectedTemplate: null });
  }

  handleChange = (e, { value }) => {
    this.setState({ selectedTemplateId: value });
    this.handleSelectTemplate(value);
  };

  handleSelectTemplate = templateId => {
    const selectedTemplate = this.state.emailTemplates.find(
      m => m.emailTemplateId === templateId
    );
    this.props.getSelectedTemplate(selectedTemplate);
    this._isMounted && this.setState({ selectedTemplate });
  };

  clearSelectedTemplate = () => {
    this._isMounted &&
      this.setState({ selectedTemplateId: "", selectedTemplate: null });
    this.props.clearSelectedTemplate();
  };

  showSuccessMessage = message => {
    this._isMounted &&
      this.setState({
        removeModalOpen: false,
        showMessage: true,
        message,
        errorMessage: false
      });
    setTimeout(() => {
      this.removeValidationMessage();
      this.clearSelectedTemplate();
    }, 2000);
  };

  showErrorMessage = message => {
    this._isMounted &&
      this.setState({
        removeModalOpen: false,
        showMessage: true,
        errorMessage: true,
        message
      });
    setTimeout(() => this.removeValidationMessage(), 3000);
  };

  removeEmailTemplate = async () => {
    const response = await this.props.removeEmailTemplate(
      this.state.selectedTemplateId
    );
    if (response.status === 200)
      this.showSuccessMessage("Email template removed successfully");
    else this.showErrorMessage(response.data[0].errorMessage);
  };

  removeValidationMessage = () => {
    this._isMounted &&
      this.setState({
        showMessage: false,
        errorMessage: false,
        message: ""
      });
  };

  closeRemoveModal = () => {
    this._isMounted && this.setState({ removeModalOpen: false });
  };

  render() {
    const {
      selectedTemplate,
      selectedTemplateId,
      emailTemplatesForDropdown,
      removeModalOpen,
      showMessage,
      message,
      errorMessage
    } = this.state;
    return (
      <Card title="Manage Email Templates" id="emailTemplatesList">
        <FormRow>
          <FormGroup>
            <Label text="Email Templates:" />
            <FlexBox>
              <Dropdown
                fullWidth
                selection
                options={emailTemplatesForDropdown}
                placeholder="Select a template.."
                onChange={this.handleChange}
                value={selectedTemplateId}
                id="emailTemplatesListEmailTemplatesDropdown"
              />
              <Button
                id="emailTemplatesListClearBtn"
                content="Clear"
                marginleft="10"
                secondary
                onClick={this.clearSelectedTemplate}
              />
            </FlexBox>
          </FormGroup>
        </FormRow>
        {selectedTemplate !== null && (
          <>
            <EmailTemplateInfo
              id="emailTemplateInfo"
              selectedTemplate={selectedTemplate}
            />
            <ButtonContainer
              justifyContent={showMessage ? "space-between" : "flex-end"}
              marginTop="35"
            >
              <Message
                show={showMessage}
                error={errorMessage}
                message={message}
                width="60"
              />
              <Button
                id="removeEmailTemplateBtn"
                content="Remove Email Template"
                secondary
                onClick={() => this.setState({ removeModalOpen: true })}
              />
            </ButtonContainer>
          </>
        )}
        <RemoveEmailTemplateModal
          id="removeEmailTemplateModal"
          closeModal={this.closeRemoveModal}
          removeEmailTemplate={this.removeEmailTemplate}
          selectedTemplate={selectedTemplate}
          removeModalOpen={removeModalOpen}
        />
      </Card>
    );
  }
}
