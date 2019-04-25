import React, { Component } from "react";
import { connect } from "react-redux";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import * as api from "api";
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

class EmailTemplateBuilder extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      templateStrings: [],
      templateName: "",
      emailSubject: "",
      emailTemplateId: 0,
      selectedLetterTemplateId: "",
      selectedTemplate: null,
      selectedCorrespondent: "",
      letterTemplatesForDropdown: [],
      message: "",
      showMessage: false
    };
    this.setItemToValidate = setItemToValidate.bind(this);
    this.validateItems = validateItems.bind(this);
    this.validateItem = validateItem.bind(this);
    this.removeValidationErrors = removeValidationErrors.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    api.getTemplateStrings().then(res => {
      if (this._isMounted) {
        const templateStrings = res.result.map((string, key) => ({
          text: `{${string}}}`,
          value: `{${string}}}`
        }));
        this.setState({ templateStrings });
      }
    });

    api.getLetterTemplates().then(res => {
      if (this._isMounted) {
        if (!res.hasErrors) {
          this.letterTemplatesForDropdown(res.result);
        }
      }
    });

    const html =
      "<p>Select an existing template to begin or create a new template 😀</p>";

    const contentBlock = htmlToDraft(html);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks
      );
      const editorState = EditorState.createWithContent(contentState);
      this.setState({ editorState });
    }
  }

  componentWillReceiveProps({ selectedTemplate }) {
    if (selectedTemplate !== null) {
      this.setState({
        selectedTemplate,
        templateName: selectedTemplate.name,
        emailTemplateId: selectedTemplate.emailTemplateId,
        selectedLetterTemplateId:
          selectedTemplate.letterTemplate.letterTemplateId,
        selectedCorrespondent: selectedTemplate.sendTo,
        emailSubject: selectedTemplate.subject
      });

      const contentBlock = htmlToDraft(selectedTemplate.content);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(
          contentBlock.contentBlocks
        );
        const editorState = EditorState.createWithContent(contentState);
        this.setState({ editorState });
      }
    } else {
      this.setState({
        selectedTemplate: null,
        templateName: "",
        emailTemplateId: "",
        selectedLetterTemplateId: "",
        selectedCorrespondent: "",
        emailSubject: ""
      });

      const html =
        "<p>Select an existing template to begin or create a new template 😀</p>";

      const contentBlock = htmlToDraft(html);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(
          contentBlock.contentBlocks
        );
        const editorState = EditorState.createWithContent(contentState);
        this.setState({ editorState });
      }
    }

    api.getLetterTemplates().then(res => {
      if (!res.hasErrors) {
        if (this._isMounted) {
          this.letterTemplatesForDropdown(res.result);
        }
      }
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  onEditorStateChange = editorState => this.setState({ editorState });

  handleChange = (e, { name, value }) => {
    this.setItemToValidate(name);
    this.setState({ [name]: value });
  };

  listToValidate = () => {
    return [
      { emailTemplateId: this.state.emailTemplateId },
      { templateName: this.state.templateName },
      { selectedLetterTemplateId: this.state.selectedLetterTemplateId },
      { selectedCorrespondent: this.state.selectedCorrespondent },
      { emailSubject: this.state.emailSubject }
    ];
  };

  letterTemplatesForDropdown = letterTemplates => {
    const letterTemplatesForDropdown = letterTemplates.map(template => ({
      text: template.name,
      value: template.letterTemplateId
    }));
    this.setState({ letterTemplatesForDropdown });
  };

  // imageUploadCallback = file =>
  //   new Promise((resolve, reject) => {
  //     api.uploadEmailTemplateImage(file).then(res => {
  //       if (this._isMounted) {
  //         if (!res.data.hasErrors) {
  //           const img = resolve({
  //             data: {
  //               link: img
  //             }
  //           });
  //         } else {
  //           reject(this.setState({ emailTemplateMessage: res }));
  //         }
  //       }
  //     });
  //   });

  saveTemplate = () => {
    let html = draftToHtml(
      convertToRaw(this.state.editorState.getCurrentContent())
    );

    this.setState({ editorContent: html }, () => {
      const content = this.state.editorContent;
      const contentBlock = htmlToDraft(content);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(
          contentBlock.contentBlocks
        );
        const editorState = EditorState.createWithContent(contentState);
        this.setState({ editorState });
      }
    });

    const template = {
      content: html,
      name: this.state.templateName,
      emailTemplateId: this.state.emailTemplateId,
      letterTemplateId: this.state.selectedLetterTemplateId,
      sendTo: this.state.selectedCorrespondent,
      subject: this.state.emailSubject,
      lastUpdatedBy: this.props.username,
      createdBy:
        this.state.selectedTemplate === null ? this.props.username : null
    };
    api.saveEmailTemplate(template).then(res => {
      if (this._isMounted) {
        if (!res.hasErrors) {
          this.setState({ showMessage: true });
          setTimeout(() => this.setState({ showMessage: false }), 3000);

          this.setState({ emailTemplates: res.data.result });
          this.props.getEmailTemplates(res.data.result);
          this.props.clearSelectedTemplate();
        }
      }
    });
  };

  validateTemplate = () => {
    var list = validateListOfStrings(this.listToValidate());
    if (list[list.length - 1].isValid) {
      this.saveTemplate();
    } else {
      this.validateItems(list);
    }
  };

  render() {
    const setEditorReference = ref => {
      this.editorReferece = ref;
    };
    return (
      <Card title="Email Template Builder">
        <FormRow>
          <FormGroup>
            <Label text="Template Name" width="100" />
            <Input
              value={this.state.templateName}
              onChange={this.handleChange}
              name="templateName"
              placeholder="Knockout Answer Given"
              valid={this.validateItem("templateName").toString()}
            />
          </FormGroup>
          <FormGroup>
            <Label text="Email Subject" width="100" />
            <Input
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
            <Label text="Associated Letter" width="100" />
            <Dropdown
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
            <Label text="Send to" width="100" />
            <Dropdown
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
            onEditorStateChange={this.onEditorStateChange}
            editorClassName="email-template-builder__editor"
            // toolbar={{
            //   image: {
            //     uploadEnabled: true,
            //     uploadCallback: this.imageUploadCallback,
            //     previewImage: true,
            //     alt: { present: true, mandatory: true }
            //   }
            // }}
            mention={{
              separator: " ",
              trigger: "{",
              suggestions: this.state.templateStrings
            }}
          />
        </div>
        <ButtonContainer justifyContent="flex-end">
          <Message
            show={this.state.showMessage}
            error={this.state.message !== ""}
            message={this.state.message}
            marginRight={45}
          />
          <Button
            content="Cancel"
            secondary
            onClick={this.props.clearSelectedTemplate}
          />
          <Button
            content="Save Template"
            primary
            onClick={this.validateTemplate}
          />
        </ButtonContainer>
      </Card>
    );
  }
}

const mapStateToProps = state => ({
  bluedogCase: state.case.selectedCase,
  username: state.auth.user.name
});

export default connect(mapStateToProps)(EmailTemplateBuilder);
