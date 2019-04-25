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
  Label,
  Dropdown,
  Input,
  Button,
  ButtonContainer,
  Modal,
  Message,
  FlexBox
} from "components/Common";

import "./ManageLetterTemplates.scss";

export default class ManageLetterTemplates extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      selectedTemplateId: "",
      letterTemplatesForDropdown: [],
      selectedTemplate: null,
      selectedTemplateName: "",
      selectedTemplatePath: "",
      fileName: "",
      letterTemplates: [],
      removeModalOpen: false,
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
    api.getLetterTemplates().then(res => {
      if (this._isMounted) {
        this.setState({ letterTemplates: res.result }, () =>
          this.letterTemplatesForDropdown(res.result)
        );
      }
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentWillReceiveProps() {
    api.getLetterTemplates().then(res => {
      if (this._isMounted) {
        this.setState({ letterTemplates: res.result }, () =>
          this.letterTemplatesForDropdown(res.result)
        );
      }
    });
  }

  handleChange = (e, { name, value }) => {
    this.setItemToValidate(name);
    this.setState({ [name]: value });
  };

  listToValidate = () => {
    return [
      { selectedTemplateId: this.state.selectedTemplateId },
      { templateName: this.state.templateName },
      { fileName: this.state.fileName },
      { selectedTemplateName: this.state.selectedTemplateName },
      { selectedTemplatePath: this.state.selectedTemplatePath }
    ];
  };

  letterTemplatesForDropdown = templates => {
    const letterTemplatesForDropdown = templates.map((template, key) => ({
      text: template.name,
      value: template.letterTemplateId,
      key
    }));
    this.setState({ letterTemplatesForDropdown });
  };

  onSelectFile = e => {
    const file = e.target.files[0];
    this.setState({ file, fileName: file.name });
  };

  onChange = (e, { name, value }) => {
    this.setItemToValidate(name);
    this.setItemToValidate("selectedTemplateName");
    this.setItemToValidate("selectedTemplatePath");
    this.setItemToValidate("fileName");
    this.setState({ [name]: value });
    const selectedTemplate = this.state.letterTemplates.find(
      m => m.letterTemplateId === value
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

  openFilePicker = () => {
    const input = document.getElementById("updatefilepicker");
    input.click();
  };

  uploadLetterTemplate = () => {
    const fileNameToParse = this.state.fileName;
    const fileName = fileNameToParse.slice(0, fileNameToParse.lastIndexOf("_"));

    api
      .uploadDocumentTemplate(
        this.state.file,
        this.state.selectedTemplateName,
        fileName,
        true,
        this.state.selectedTemplateId
      )
      .then(res => {
        if (this._isMounted) {
          if (!res.data.hasErrors) {
            this.setState(
              {
                letterTemplates: res.data.result,
                showMessage: true,
                removeModalOpen: false
              },
              () => this.letterTemplatesForDropdown(res.data.result)
            );
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

  validateLetterTemplate = () => {
    var list = validateListOfStrings(this.listToValidate());
    if (list[list.length - 1].isValid) {
      this.uploadLetterTemplate();
    } else {
      this.validateItems(list);
    }
  };

  removeLetterTemplate = id => {
    const template = {
      letterTemplateId: id,
      path: this.state.selectedTemplatePath
    };
    api.removeLetterTemplate(template).then(res => {
      if (this._isMounted) {
        if (!res.data.hasErrors) {
          this.setState(
            {
              letterTemplates: res.data.result,
              showMessage: true,
              removeModalOpen: false
            },
            () => this.letterTemplatesForDropdown(res.data.result)
          );
          this.clearForm();
          this.props.getLetterTemplates(res.data.result);
          setTimeout(() => this.setState({ showMessage: false }), 3000);
        } else {
          this.setState({
            removeModalOpen: false,
            showMessage: true,
            message: res.data.errors[0].errorMessage
          });
          setTimeout(() => this.setState({ showMessage: false }), 6000);
        }
      }
    });
  };

  validateRemoveLetterTemplate = id => {
    var list = validateListOfStrings(this.listToValidate());
    if (list[list.length - 1].isValid) {
      this.removeLetterTemplate(id);
    } else {
      this.setState({ removeModalOpen: false });
      this.validateItems(list);
    }
  };

  clearForm = () => {
    this.setState({
      file: null,
      templateName: "",
      fileName: "",
      selectedTemplate: null,
      selectedTemplateName: "",
      selectedTemplatePath: "",
      selectedTemplateId: ""
    });
  };

  render() {
    return (
      <Card title="Manage Letter Templates">
        <div>
          <FormRow>
            <FormGroup>
              <Label text="Template To Update:" width="100" />
              <Dropdown
                options={this.state.letterTemplatesForDropdown}
                selection
                onChange={this.onChange}
                value={this.state.selectedTemplateId}
                name="selectedTemplateId"
                placeholder="Select a template..."
                valid={this.validateItem("selectedTemplateId").toString()}
              />
            </FormGroup>
            <FormGroup>
              <Label text="Template Name:" width="100" />
              <Input
                value={this.state.selectedTemplateName}
                placeholder="Knockout Answer Given"
                name="selectedTemplateName"
                onChange={this.handleChange}
                valid={this.validateItem("selectedTemplateName").toString()}
              />
            </FormGroup>
          </FormRow>
          <FormRow>
            <FormGroup>
              <Label text="File" width="100" />
              <Input
                type="file"
                onChange={this.onSelectFile}
                style={{ display: "none" }}
                id="updatefilepicker"
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
          <ButtonContainer justifyContent="space-between" marginTop="15">
            <Button
              content="Remove Template"
              secondary
              onClick={() => this.setState({ removeModalOpen: true })}
            />
            <div>
              <Button content="Cancel" secondary onClick={this.clearForm} />
              <Button
                content="Update Template"
                primary
                onClick={this.validateLetterTemplate}
              />
            </div>
          </ButtonContainer>
          <FlexBox>
            <Message
              show={this.state.showMessage}
              error={this.state.message !== ""}
              message={this.state.message}
              marginTop="25"
            />
          </FlexBox>
        </div>
        <Modal
          isModalOpen={this.state.removeModalOpen}
          title="Remove Letter Template"
          message="Are you sure you want to remove this letter template?"
          item={this.state.selectedTemplateName}
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
                this.validateRemoveLetterTemplate(this.state.selectedTemplateId)
              }
            />
          </ButtonContainer>
        </Modal>
      </Card>
    );
  }
}
