import React, { Component } from "react";
import * as api from "api";
import {withErrorHandling} from "HOCs";
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
  Input,
  Label,
  Button,
  ButtonContainer,
  Message
} from "components/Common";

import "./AddLetterTemplate.scss";

class AddLetterTemplate extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      templateName: "",
      fileName: "",
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
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleChange = (e, { name, value }) => {
    this.setItemToValidate(name);
    this.hideValidationMessage();
    this.setState({ [name]: value });
  };

  handleOpenFilePicker = () => {
    const input = document.getElementById("addfilepicker");
    input.click();
  };

  handleSelectFile = e => {
    this.setItemToValidate("fileName");
    const file = e.target.files[0];
    this.setState({
      file,
      fileName: file.name,
      errorMessage: false,
      showMessage: false
    });
  };

  listToValidate = () => {
    return [
      { fileName: this.state.fileName },
      { templateName: this.state.templateName }
    ];
  };

  sendUploadDocumentRequest = async () => {
    const fileNameToParse = this.state.fileName;
    const fileName = fileNameToParse.slice(0, fileNameToParse.lastIndexOf("_"));

    const response = await api.uploadDocumentTemplate(
      this.state.file,
      this.state.templateName,
      fileName,
      this.props.username,
      0
    );

    return response;
  };

  uploadDocument = async () => {
    const response = await this.sendUploadDocumentRequest();
    if (response !== undefined) {
      if (response.status === 200 && this._isMounted) {
        this.showSuccessMessage("Letter Template uploaded successfully");
        this.props.getLetterTemplates(response.data);
      } else this.showErrorMessage(response.data[0].errorMessage);
    } else this.props.showErrorModal();
  };

  validateDocument = () => {
    var list = validateListOfStrings(this.listToValidate());
    if (list[list.length - 1].isValid) this.uploadDocument();
    else {
      this.validateItems(list);
      this.showValidationMessage();
    }
  };

  showValidationMessage = () => {
    this._isMounted &&
      this.setState({
        errorMessage: true,
        showMessage: true,
        message: "Please fill in all the fields before submitting"
      });
  };

  hideValidationMessage = () => {
    this._isMounted &&
      this.setState({
        errorMessage: false,
        showMessage: false,
        message: ""
      });
  };

  showSuccessMessage = message => {
    this._isMounted &&
      this.setState({
        showMessage: true,
        message,
        errorMessage: false
      });
    setTimeout(() => this.clearForm(), 3000);
  };

  showErrorMessage = message => {
    this._isMounted &&
      this.setState({
        errorMessage: true,
        showMessage: true,
        message
      });
    setTimeout(() => this.setState({ showMessage: false }), 3000);
  };

  clearForm = () => {
    this.removeValidationErrors(this.listToValidate());
    this.hideValidationMessage();
    this._isMounted &&
      this.setState({
        file: null,
        fileName: "",
        templateName: ""
      });
  };

  render() {
    return (
      <Card title="Add Letter Template" id="addLetterTemplate">
        <div className="add-letter-template">
          <FormRow>
            <FormGroup>
              <Label text="Template Name" />
              <Input
                name="templateName"
                fullWidth
                value={this.state.templateName}
                onChange={this.handleChange}
                placeholder="Knockout Answer Given"
                valid={this.validateItem("templateName").toString()}
                id="addLetterTemplateTemplateNameTextBox"
              />
            </FormGroup>
            <FormGroup>
              <Label text="File" />
              <Input
                type="file"
                onChange={this.handleSelectFile}
                style={{ display: "none" }}
                id="addfilepicker"
              />
              <Input
                fullWidth
                onClick={this.handleOpenFilePicker}
                value={this.state.fileName}
                name="fileName"
                placeholder="Knockout_Answer_Given_Template.docx"
                valid={this.validateItem("fileName").toString()}
                id="addLetterTemplateFileNameTextBox"
              />
            </FormGroup>
          </FormRow>
          <ButtonContainer justifyContent="flex-end" marginTop="15">
            <Message
              show={this.state.showMessage}
              error={this.state.errorMessage}
              message={this.state.message}
              marginRight={45}
              id="addLetterTemplateMessage"
            />
            <Button
              content="Cancel"
              secondary
              onClick={this.clearForm}
              id="addLetterTemplateCancelBtn"
            />
            <Button
              content="Add Template"
              primary
              onClick={this.validateDocument}
              id="addLetterTemplateAddBtn"
            />
          </ButtonContainer>
        </div>
      </Card>
    );
  }
}
export default withErrorHandling(AddLetterTemplate);
