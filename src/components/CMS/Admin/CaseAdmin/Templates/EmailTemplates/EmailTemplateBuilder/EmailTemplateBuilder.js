import React, { Component } from "react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import { correspondent } from "helpers/dropdowns";

import {
  validateListOfStrings,
  validateItems,
  removeValidationErrors,
  validateItem,
  setItemToValidate
} from "helpers/validation";

import {
  Card,
  Button,
  ButtonContainer,
  FormGroup,
  FormRow,
  Label,
  Input,
  Dropdown,
  Message
} from "components/Common";

import "../../../../../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./EmailTemplateBuilder.scss";

const DEFAULT_HTML =
  "<p>Select an existing template to begin or create a new template 😀</p>";

export default class EmailTemplateBuilder extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      templateName: "",
      emailSubject: "",
      emailTemplateId: 0,
      selectedLetterTemplateId: "",
      selectedTemplate: null,
      selectedCorrespondent: "",
      message: "",
      errorMessage: false,
      showMessage: false,
      templateStrings:
        props.templateStrings !== undefined ? props.templateStrings : [],
      letterTemplatesForDropdown:
        props.letterTemplatesForDropdown !== undefined
          ? props.letterTemplatesForDropdown
          : [],
      emailTemplatesForDropdown:
        props.emailTemplatesForDropdown !== undefined
          ? props.emailTemplatesForDropdown
          : []
    };
    this.setItemToValidate = setItemToValidate.bind(this);
    this.validateItems = validateItems.bind(this);
    this.validateItem = validateItem.bind(this);
    this.removeValidationErrors = removeValidationErrors.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    this.setEditorContent(DEFAULT_HTML);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentWillReceiveProps({
    selectedTemplate,
    letterTemplatesForDropdown,
    templateStrings
  }) {
    this.hideValidationMessage();
    if (letterTemplatesForDropdown !== undefined)
      this.setState({ letterTemplatesForDropdown });
    if (templateStrings !== undefined) this.setState({ templateStrings });
    if (selectedTemplate !== null) {
      this.setSelectedTemplate(selectedTemplate);
      this.setEditorContent(selectedTemplate.content);
    } else {
      this.removeSelectedTemplate();
      this.setEditorContent(DEFAULT_HTML);
    }
  }

  handleEditorStateChange = editorState => this.setState({ editorState });

  handleChange = (e, { name, value }) => {
    this.setItemToValidate(name);
    this.setState({ [name]: value });
  };

  listToValidate = () => {
    return [
      { templateName: this.state.templateName },
      { selectedLetterTemplateId: this.state.selectedLetterTemplateId },
      { selectedCorrespondent: this.state.selectedCorrespondent },
      { emailSubject: this.state.emailSubject }
    ];
  };

  setSelectedTemplate = selectedTemplate => {
    this.setState({
      selectedTemplate,
      templateName: selectedTemplate.name,
      emailTemplateId: selectedTemplate.emailTemplateId,
      selectedLetterTemplateId:
        selectedTemplate.letterTemplate.letterTemplateId,
      selectedCorrespondent: selectedTemplate.sendTo,
      emailSubject: selectedTemplate.subject
    });
  };

  removeSelectedTemplate = () => {
    this.setState({
      selectedTemplate: null,
      templateName: "",
      emailTemplateId: 0,
      selectedLetterTemplateId: "",
      selectedCorrespondent: "",
      emailSubject: ""
    });
  };

  setEditorContent = content => {
    this.setState({ editorContent: content });
    const contentBlock = htmlToDraft(content);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks
      );
      const editorState = EditorState.createWithContent(contentState);
      this.setState({ editorState });
    }
  };

  emailTemplateToSave = html => ({
    content: html,
    name: this.state.templateName,
    emailTemplateId: this.state.emailTemplateId,
    letterTemplateId: this.state.selectedLetterTemplateId,
    sendTo: this.state.selectedCorrespondent,
    subject: this.state.emailSubject,
    lastUpdatedBy: this.props.username,
    createdBy:
      this.state.selectedTemplate === null ? this.props.username : null,
    actionedBy: this.props.username
  });

  getHtmlForEmailTemplate = () => {
    return draftToHtml(
      convertToRaw(this.state.editorState.getCurrentContent())
    );
  };

  showSuccessMessage = message => {
    this.setState({
      message,
      showMessage: true,
      errorMessage: false
    });
    setTimeout(() => this.setState({ showMessage: false }), 3000);
  };

  showErrorMessage = message => {
    this.setState({
      message,
      showMessage: true,
      errorMessage: true
    });
    setTimeout(() => this.setState({ showMessage: false }), 3000);
  };

  saveEmailTemplate = async () => {
    let html = this.getHtmlForEmailTemplate();
    const emailTemplate = this.emailTemplateToSave(html);
    this.setEditorContent(html);

    const response = await this.props.saveEmailTemplate(emailTemplate);

    if (response.status === 200) {
      this.showSuccessMessage("Email template saved successfully");
    } else this.showErrorMessage(response.data[0].errorMessage);
  };

  validateTemplate = () => {
    var list = validateListOfStrings(this.listToValidate());
    if (list[list.length - 1].isValid) this.saveEmailTemplate();
    else {
      this.validateItems(list);
      this.showValidationMessage();
    }
  };

  showValidationMessage = () => {
    this._isMounted &&
      this.setState({
        message: "Please fill in all the fields before submitting",
        errorMessage: true,
        showMessage: true
      });
  };

  hideValidationMessage = () => {
    this.removeValidationErrors(this.listToValidate());
    this._isMounted &&
      this.setState({
        message: "",
        errorMessage: false,
        showMessage: false
      });
  };

  clearForm = () => {
    this.props.clearSelectedTemplate();
    this.hideValidationMessage();
    this._isMounted &&
      this.setState({
        templateName: "",
        emailSubject: "",
        emailTemplateId: 0,
        selectedLetterTemplateId: "",
        selectedTemplate: null,
        selectedCorrespondent: ""
      });
  };

  render() {
    const setEditorReference = ref => {
      this.editorReferece = ref;
    };
    return (
      <Card title="Email Template Builder" id="emailTemplateBuilder">
        <FormRow>
          <FormGroup>
            <Label text="Template Name" />
            <Input
              id="emailTemplateBuilderEmailTemplateNameTextBox"
              fullWidth
              value={this.state.templateName}
              onChange={this.handleChange}
              name="templateName"
              placeholder="Knockout Answer Given"
              valid={this.validateItem("templateName").toString()}
            />
          </FormGroup>
          <FormGroup>
            <Label text="Email Subject" />
            <Input
              id="emailTemplateBuilderEmailTemplateSubjectTextBox"
              fullWidth
              value={this.state.emailSubject}
              onChange={this.handleChange}
              name="emailSubject"
              placeholder="A Mi3D injured party has failed..."
              valid={this.validateItem("emailSubject").toString()}
            />
          </FormGroup>
        </FormRow>
        <FormRow>
          <FormGroup>
            <Label text="Associated Letter" />
            <Dropdown
              id="emailTemplateBuilderEmailTemplateLetterDropdown"
              fullWidth
              selection
              options={this.state.letterTemplatesForDropdown}
              placeholder="Select a letter.."
              value={this.state.selectedLetterTemplateId}
              name="selectedLetterTemplateId"
              onChange={this.handleChange}
              valid={this.validateItem("selectedLetterTemplateId").toString()}
            />
          </FormGroup>
          <FormGroup>
            <Label text="Send to" />
            <Dropdown
              id="emailTemplateBuilderEmailTemplateCorrespondentDropdown"
              fullWidth
              selection
              options={correspondent}
              placeholder="Select a correspondent.."
              value={this.state.selectedCorrespondent}
              name="selectedCorrespondent"
              onChange={this.handleChange}
              valid={this.validateItem("selectedCorrespondent").toString()}
            />
          </FormGroup>
        </FormRow>
        <div
          className="email-template-builder"
          ref={editorContainer => (this.editorContainer = editorContainer)}
        >
          <Editor
            editorRef={setEditorReference}
            editorState={this.state.editorState}
            onEditorStateChange={this.handleEditorStateChange}
            editorClassName="email-template-builder__editor"
            mention={{
              separator: " ",
              trigger: "{",
              suggestions: this.state.templateStrings
            }}
          />
        </div>
        <ButtonContainer justifyContent="flex-end">
          <Message
            id="emailBuilderMessage"
            show={this.state.showMessage}
            error={this.state.errorMessage}
            message={this.state.message}
            marginRight={45}
          />
          <Button
            id="emailTemplateBuilderCancelBtn"
            content="Cancel"
            secondary
            onClick={this.clearForm}
          />
          <Button
            id="emailTemplateBuilderSaveTemplateBtn"
            content="Save Template"
            primary
            onClick={this.validateTemplate}
          />
        </ButtonContainer>
      </Card>
    );
  }
}
