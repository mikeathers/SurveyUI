import React, { Component } from "react";
import { connect } from "react-redux";
import * as api from "api";
import { injuredPartyDetailsForDocument } from "helpers/util";
import Modal from "react-modal";
import {
  ButtonContainer,
  Button,
  Label,
  Dropdown,
  Form,
  FormRow,
  FormGroup,
  TextArea,
  Loader,
  FlexBox
} from "components/Common";

import "./CaseModal.scss";

class CaseModal extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      selectedStopCaseReasonId: "",
      bluedogCaseValues: null,
      emailToSend: null,
      documentToCreate: null,
      showLoader: false,
      stopCaseReasonsForDropdown: [],
      stopCaseReasons: []
    };
  }

  componentDidMount() {
    this._isMounted = true;
    const bluedogCaseValues = injuredPartyDetailsForDocument(this.props.case);
    this.setState({ bluedogCaseValues });

    api.getStopCaseReasons().then(res => {
      if (res.status === 200) {
        if (this._isMounted) {
          this.setState({ stopCaseReasons: res.data });
          this.stopCaseReasonsForDropdown(res.data);
        }
      }
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  stopCaseReasonsForDropdown = reasons => {
    const stopCaseReasonsForDropdown = reasons.map((reason, key) => ({
      text: reason.text,
      value: reason.emailTemplate.emailTemplateId,
      key
    }));
    this.setState({ stopCaseReasonsForDropdown });
    return stopCaseReasonsForDropdown;
  };

  createHtmlEmailTemplate = html => {
    const valuesFromContent = html.split(/[{{}}]/);
    const parsedValues = valuesFromContent
      .map(c => {
        if (c !== "" && !c.includes(">")) return c;
        else return null;
      })
      .filter(m => m !== undefined);

    parsedValues.forEach(x => {
      const valueToFind = `{{${x}}}`;

      const startValueIndex = html.search(valueToFind);
      const endValueIndex = html.indexOf("}}", startValueIndex);
      const length = endValueIndex - startValueIndex + 2;

      const openTagOpen = html.lastIndexOf("<a", startValueIndex);
      const openTagClose = html.lastIndexOf(">", startValueIndex);
      const openTagLength = openTagClose - openTagOpen + 1;

      const closeTagOpen = html.indexOf("<", startValueIndex);
      const closeTagClose = html.indexOf(">", startValueIndex);
      const closeTagLength = closeTagClose - closeTagOpen + 1;

      const searchString = html.substr(startValueIndex, length);
      const openTag = html.substr(openTagOpen, openTagLength);
      const closeTag = html.substr(closeTagOpen, closeTagLength);

      if (searchString !== "" && openTag !== "" && closeTag !== "<p>") {
        html = html.replace(openTag, "");
        html = html.replace(closeTag, "");
      }
      const bluedogCaseValues = this.state.bluedogCaseValues;

      Object.keys(bluedogCaseValues).forEach(key => {
        if (x === key) {
          html = html.replace(valueToFind, bluedogCaseValues[key]);
        }
      });
    });
    return html;
  };

  handleReasonChange = (e, { name, value }) => {
    this.setState({ [name]: value });

    const emailTemplateRequest = {
      emailTemplateId: value,
      actionedBy: this.props.username
    };

    api.getEmailTemplate(emailTemplateRequest).then(res => {
      if (res.status === 200) {
        const emailTemplate = res.data;
        const emailContent = this.createHtmlEmailTemplate(
          emailTemplate.content
        );
        const emailToSend = {
          body: emailContent,
          subject: emailTemplate.subject,
          from: "michael.atherton@premex.com",
          to: "michael.atherton@premex.com"
        };

        const documentToCreate = {
          templateName: emailTemplate.letterTemplate.fileName,
          ...this.state.bluedogCaseValues
        };
        this.setState({ emailToSend, documentToCreate });
      }
    });
  };

  holdCase = () => {
    const documentToCreate = this.state.documentToCreate;
    this.setState({ showLoader: true });
    api.createLetterDocument(documentToCreate).then(res => {
      if (res.status === 200) {
        const letterPath = res.data;
        const emailToSend = {
          ...this.state.emailToSend,
          attachments: [letterPath]
        };
        this.props.closeModal();
        api.sendEmail(emailToSend).then(res => {
          this.setState({ showLoader: false, isModalOpen: false });
        });
      } else {
        const errors = {
          errorMessages: res.data.errors.map(m => m.errorMessage),
          serviceName: "DocumentBuilder",
          functionName: "CreateDocument",
          actionedBy: this.props.user.name
        };
        api.logErrors(errors);
      }
    });
  };

  render() {
    const customStyles = {
      content: {
        height: `${this.props.modalHeight}px`
      }
    };
    const bodyStyles = {
      height: `${this.props.bodyHeight}px`
    };
    return (
      <Modal
        ariaHideApp={false}
        isOpen={this.props.isModalOpen}
        contentLabel="Case Modal"
        className="case-modal"
        style={customStyles}
      >
        <div className="case-modal__title">
          <h3>{this.props.title}</h3>
        </div>
        <hr />
        <div style={bodyStyles} className="case-modal__body">
          {this.props.text !== undefined && (
            <FormRow marginBottom="25">
              <p className="case-modal__text">{this.props.text}</p>
            </FormRow>
          )}
          <FormRow marginBottom="15">
            <FormGroup flexBasis="100">
              <Label width="100" text={this.props.reasonText} />
              <Dropdown
                selection
                options={this.state.stopCaseReasonsForDropdown}
                placeholder="Select Reason.."
                onChange={this.handleReasonChange}
                name="selectedStopCaseReasonId"
                value={this.state.selectedStopCaseReasonId}
              />
            </FormGroup>
          </FormRow>
          <FormRow>
            <FormGroup flexBasis="100">
              <Label width="100" text="Additional Information" />
              <Form>
                <TextArea />
              </Form>
            </FormGroup>
          </FormRow>
        </div>
        <hr />
        <div className="case-modal__footer">
          <ButtonContainer
            justifyContent={
              this.state.showLoader ? "space-between" : "flex-end"
            }
          >
            {this.state.showLoader && (
              <FlexBox alignItems="center" justifyContent="center">
                <Label text="Putting case on hold.." width="100" />
                <Loader active={this.state.showLoader} inline />
              </FlexBox>
            )}
            <div>
              <Button
                content="Cancel"
                secondary
                onClick={this.props.closeModal}
              />
              <Button
                content={this.props.buttonContent}
                primary
                onClick={this.holdCase}
              />
            </div>
          </ButtonContainer>
        </div>
      </Modal>
    );
  }
}
const mapStateToProps = state => ({
  case: state.case.selectedCase,
  mi3dCase: state.case.mi3dCase,
  username: state.auth.user.name
});

export default connect(mapStateToProps)(CaseModal);
