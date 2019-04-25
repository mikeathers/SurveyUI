import React, { Component } from "react";
import * as api from "api";
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

export default class AddLetterTemplate extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      templateName: "",
      fileName: "",
      showMessage: false,
      message: ""
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

  onSelectFile = e => {
    this.setItemToValidate("fileName");
    const file = e.target.files[0];
    this.setState({ file, fileName: file.name });
  };

  handleChange = (e, { name, value }) => {
    this.setItemToValidate(name);
    this.setState({ [name]: value });
  };

  listToValidate = () => {
    return [
      { fileName: this.state.fileName },
      { templateName: this.state.templateName }
    ];
  };

  openFilePicker = () => {
    const input = document.getElementById("addfilepicker");
    input.click();
  };

  clearForm = () => {
    this.setState({
      file: null,
      templateName: "",
      fileName: ""
    });
  };

  uploadDocument = () => {
    const fileNameToParse = this.state.fileName;
    const fileName = fileNameToParse.slice(0, fileNameToParse.lastIndexOf("_"));

    api
      .uploadDocumentTemplate(
        this.state.file,
        this.state.templateName,
        fileName,
        false,
        0
      )
      .then(res => {
        if (this._isMounted) {
          if (!res.data.hasErrors) {
            this.setState({ showMessage: true });
            this.clearForm();
            this.props.getLetterTemplates(res.data.result);
            setTimeout(() => this.setState({ showMessage: false }), 3000);
          } else {
            this.setState({
              showMessage: true,
              message: res.data.errors[0].message
            });
            setTimeout(() => this.setState({ showMessage: false }), 3000);
          }
        }
      });
  };

  validateDocument = () => {
    var list = validateListOfStrings(this.listToValidate());
    if (list[list.length - 1].isValid) {
      this.uploadDocument();
    } else {
      this.validateItems(list);
    }
  };

  render() {
    return (
      <Card title="Add Letter Template">
        <div className="add-letter-template">
          <FormRow>
            <FormGroup>
              <Label text="Template Name" />
              <Input
                name="templateName"
                value={this.state.templateName}
                onChange={this.handleChange}
                placeholder="Knockout Answer Given"
                valid={this.validateItem("templateName").toString()}
              />
            </FormGroup>
            <FormGroup>
              <Label text="File" width="100" />
              <Input
                type="file"
                onChange={this.onSelectFile}
                style={{ display: "none" }}
                id="addfilepicker"
              />
              <Input
                onClick={this.openFilePicker}
                value={this.state.fileName}
                name="fileName"
                placeholder="Knockout_Answer_Given_Template.docx"
                valid={this.validateItem("fileName").toString()}
              />
            </FormGroup>
          </FormRow>
          <ButtonContainer justifyContent="flex-end" marginTop="15">
            <Message
              show={this.state.showMessage}
              error={this.state.message !== ""}
              message={this.state.message}
              marginRight={45}
            />
            <Button content="Cancel" secondary onClick={this.clearForm} />
            <Button
              content="Add Template"
              primary
              onClick={this.validateDocument}
            />
          </ButtonContainer>
        </div>
      </Card>
    );
  }
}
