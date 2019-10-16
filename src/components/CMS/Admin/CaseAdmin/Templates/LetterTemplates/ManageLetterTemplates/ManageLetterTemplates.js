import React, { Component } from "react";
import _ from "lodash";
import * as api from "api";
import {withErrorHandling} from "HOCs";
import RemoveLetterTemplateModal from "./RemoveLetterTemplateModal";
import {
  validateListOfStrings,
  validateItems,
  removeValidationErrors,
  validateItem,
  setItemToValidate
} from "helpers/validation";

import {
  Card,
  FormRow,
  FormGroup,
  Label,
  Dropdown,
  Input,
  Button,
  ButtonContainer,
  Message,
  FlexBox
} from "components/Common";

import "./ManageLetterTemplates.scss";

class ManageLetterTemplates extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      removeModalOpen: false,
      file: null,
      fileName: "",
      selectedTemplateId: "",
      selectedTemplate: null,
      selectedTemplateName: "",
      selectedTemplatePath: "",
      letterTemplatesForDropdown: [],
      letterTemplates: [],
      showMessage: false,
      message: "",
      errorMessage: false
    };

    this.setItemToValidate = setItemToValidate.bind(this);
    this.validateItems = validateItems.bind(this);
    this.validateItem = validateItem.bind(this);
    this.removeValidationErrors = removeValidationErrors.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    this.getLetterTemplates();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentWillReceiveProps({ letterTemplates }) {
    if (letterTemplates !== undefined) {
      this.setState({ letterTemplates }, () => {
        this.mapLetterTemplatesForDropdown(letterTemplates);
      });
    }
  }

  getLetterTemplates = async () => {
    const response = await api.getLetterTemplates();
    if (response !== undefined) {
      if (response.status === 200 && this._isMounted) {
        const letterTemplates = _.orderBy(response.data, "name");
        this.setState({ letterTemplates }, () => {
          this.mapLetterTemplatesForDropdown(letterTemplates);
        });
      }
    } else this.props.showErrorModal();
  };

  mapLetterTemplatesForDropdown = templates => {
    const letterTemplatesForDropdown = templates.map((template, key) => ({
      text: template.name,
      value: template.letterTemplateId,
      key
    }));
    this.setState({ letterTemplatesForDropdown });
  };

  handleChange = (e, { name, value }) => {
    this.setItemToValidate(name);
    this.hideValidationMessage();
    this.setState({ [name]: value });
  };

  handleSelectFile = e => {
    const file = e.target.files[0];
    this.setState({ file, fileName: file.name });
    this.hideValidationMessage();
  };

  handleOpenFilePicker = () => {
    const input = document.getElementById("updatefilepicker");
    input.click();
  };

  handleDropdownChange = (e, { name, value }) => {
    this.hideValidationMessage();
    this.setItemsToValidate(name);
    this.setState({ [name]: value });
    this.handleSelectLetterTemplate(value);
  };

  handleSelectLetterTemplate = letterTemplateId => {
    const selectedTemplate = this.state.letterTemplates.find(
      m => m.letterTemplateId === letterTemplateId
    );
    const index = selectedTemplate.path.lastIndexOf("\\");
    const fileName = selectedTemplate.path.substr(index + 1);
    this.setState({
      selectedTemplate,
      selectedTemplateName: selectedTemplate.name,
      selectedTemplatePath: selectedTemplate.path,
      fileName
    });
  };

  listToValidate = () => {
    return [
      { selectedTemplateId: this.state.selectedTemplateId },
      { fileName: this.state.fileName },
      { selectedTemplateName: this.state.selectedTemplateName },
      { selectedTemplatePath: this.state.selectedTemplatePath }
    ];
  };

  setItemsToValidate = itemToValidate => {
    this.setItemToValidate(itemToValidate);
    this.setItemToValidate("selectedTemplateName");
    this.setItemToValidate("selectedTemplatePath");
    this.setItemToValidate("fileName");
  };

  sendUploadLetterTemplateRequest = async () => {
    const { file, selectedTemplateName, selectedTemplateId } = this.state;
    const fileNameToParse = this.state.fileName;
    const fileName = fileNameToParse.slice(0, fileNameToParse.lastIndexOf("_"));

    const response = await api.uploadDocumentTemplate(
      file,
      selectedTemplateName,
      fileName,
      this.props.username,
      selectedTemplateId
    );

    return response;
  };

  uploadLetterTemplate = async () => {
    var response = await this.sendUploadLetterTemplateRequest();
    if (response !== undefined) {
      if (response.status === 200 && this._isMounted) {
        this.showSuccessMessage("Letter Template updated successfully");
        this.setState({ letterTemplates: response.data });
        this.mapLetterTemplatesForDropdown(response.data);
        this.props.getLetterTemplates(response.data);
      } else this.showErrorMessage(response.data[0].errorMessage);
    } else this.props.showErrorModal();
  };

  validateLetterTemplate = () => {
    var list = validateListOfStrings(this.listToValidate());
    if (list[list.length - 1].isValid) this.uploadLetterTemplate();
    else {
      this.validateItems(list);
      this.showValidationMessage();
    }
  };

  sendRemoveLetterTemplateRequest = async () => {
    const { selectedTemplateId, selectedTemplatePath } = this.state;
    const template = {
      letterTemplateId: selectedTemplateId,
      path: selectedTemplatePath,
      actionedBy: this.props.username
    };
    return await api.removeLetterTemplate(template);
  };

  removeLetterTemplate = async () => {
    const response = await this.sendRemoveLetterTemplateRequest();
    if (response !== undefined) {
      if (response.status === 200 && this._isMounted) {
        this.showSuccessMessage("Letter Template removed successfully");
        this.setState({ letterTemplates: response.data });
        this.mapLetterTemplatesForDropdown(response.data);
        this.props.getLetterTemplates(response.data);
      } else this.showErrorMessage(response.data[0].errorMessage);
    } else this.props.showErrorModal();
  };

  validateRemoveLetterTemplate = () => {
    var list = validateListOfStrings(this.listToValidate());
    if (list[list.length - 1].isValid) {
      this.setState({ removeModalOpen: true });
    } else {
      this.setState({ removeModalOpen: false });
      this.validateItems(list);
      this.showValidationMessage();
    }
  };

  showSuccessMessage = message => {
    this.setState({
      showMessage: true,
      removeModalOpen: false,
      message
    });
    setTimeout(() => this.clearForm(), 3000);
  };

  showErrorMessage = message => {
    this.setState({
      removeModalOpen: false,
      showMessage: true,
      message: message,
      errorMessage: true
    });
    setTimeout(() => this.setState({ showMessage: false }), 3000);
  };

  showValidationMessage = () => {
    this.setState({
      showMessage: true,
      errorMessage: true,
      message: "Please fill in all the fields before submitting"
    });
  };

  hideValidationMessage = () => {
    this.setState({
      showMessage: false,
      errorMessage: false,
      message: ""
    });
  };

  clearForm = () => {
    if (this._isMounted) {
      this.setState({
        file: null,
        templateName: "",
        fileName: "",
        selectedTemplate: null,
        selectedTemplateName: "",
        selectedTemplatePath: "",
        selectedTemplateId: "",
        showMessage: false,
        errorMessage: false,
        message: ""
      });
      this.removeValidationErrors(this.listToValidate());
    }
  };

  render() {
    const {
      removeModalOpen,
      selectedTemplateName,
      selectedTemplateId,
      letterTemplatesForDropdown,
      fileName,
      showMessage,
      message,
      errorMessage
    } = this.state;
    return (
      <Card title="Manage Letter Templates" id="manageLetterTemplates">
        <div>
          <FormRow>
            <FormGroup>
              <Label text="Template To Update:" />
              <Dropdown
                fullWidth
                options={letterTemplatesForDropdown}
                search
                selection
                onChange={this.handleDropdownChange}
                value={selectedTemplateId}
                name="selectedTemplateId"
                placeholder="Select a template..."
                valid={this.validateItem("selectedTemplateId").toString()}
                id="manageLetterTemplatesTemplatesDropdown"
              />
            </FormGroup>
            <FormGroup>
              <Label text="Template Name:" />
              <Input
                fullWidth
                value={selectedTemplateName}
                placeholder="Knockout Answer Given"
                name="selectedTemplateName"
                onChange={this.handleChange}
                valid={this.validateItem("selectedTemplateName").toString()}
                id="manageLetterTemplatesTemplateNameTextBox"
              />
            </FormGroup>
          </FormRow>
          <FormRow>
            <FormGroup>
              <Label text="File" />
              <Input
                fullWidth
                type="file"
                onChange={this.handleSelectFile}
                style={{ display: "none" }}
                id="updatefilepicker"
              />
              <Input
                fullWidth
                onClick={this.handleOpenFilePicker}
                value={fileName}
                name="fileName"
                placeholder="Knockout_Answer_Given_Template.docx"
                valid={this.validateItem("fileName").toString()}
                id="manageLetterTemplatesFileNameTextBox"
              />
            </FormGroup>
          </FormRow>
          <ButtonContainer justifyContent="space-between" marginTop="15">
            <Button
              content="Remove Template"
              secondary
              onClick={this.validateRemoveLetterTemplate}
              id="manageLetterTemplatesRemoveBtn"
              disabled={this.state.selectedTemplateId === ""}
            />
            <div>
              <Button
                content="Cancel"
                secondary
                onClick={this.clearForm}
                id="manageLetterTemplatesCancelBtn"
              />
              <Button
                content="Update Template"
                primary
                onClick={this.validateLetterTemplate}
                id="manageLetterTemplatesUpdateBtn"
              />
            </div>
          </ButtonContainer>
          <FlexBox justifyContent="flex-end">
            <Message
              show={showMessage}
              message={message}
              marginTop="25"
              error={errorMessage}
              id="manageLetterTemplatesMessage"
            />
          </FlexBox>
        </div>
        <RemoveLetterTemplateModal
          id="manageLetterTemplatesRemoveModal"
          removeModalOpen={removeModalOpen}
          selectedTemplateName={selectedTemplateName}
          closeModal={() => this.setState({ removeModalOpen: false })}
          removeLetterTemplate={this.removeLetterTemplate}
        />
      </Card>
    );
  }
}
export default withErrorHandling(ManageLetterTemplates);
