import React, { Component } from "react";
import Modal from "react-modal";
import {
  validateListOfStrings,
  validateItems,
  removeValidationErrors,
  validateItem,
  setItemToValidate
} from "helpers/validation";

import {
  ButtonContainer,
  Button,
  Form,
  TextArea,
  Label
} from "components/Common";
import "./CaseNotesModal.scss";

export default class CaseNotesModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      noteText: "",
      noteId: "",
      receivedProps: false
    };

    this.setItemToValidate = setItemToValidate.bind(this);
    this.validateItems = validateItems.bind(this);
    this.validateItem = validateItem.bind(this);
    this.removeValidationErrors = removeValidationErrors.bind(this);
  }
  componentWillReceiveProps({ note }) {
    if (note !== null) {
      this.setState({ noteText: note.noteText });
    }
  }

  handleChange = (e, { name, value }) => {
    this.setItemToValidate(name);
    this.setState({ [name]: value });
  };

  listToValidate = () => {
    return [{ noteText: this.state.noteText }];
  };

  closeModal = () => {
    this.props.closeModal();
  };

  saveNote = () => {
    if (this.props.addNew) this.props.createNote(this.state.noteText);
    else this.props.updateNote(this.state.noteText);
    this.setState({ noteText: "", noteId: "" });
  };

  validateNote = () => {
    var list = validateListOfStrings(this.listToValidate());
    console.log(list);
    if (list[list.length - 1].isValid) {
      this.saveNote();
    } else {
      this.validateItems(list);
    }
  };
  render() {
    return (
      <div>
        <Modal
          ariaHideApp={false}
          isOpen={this.props.isModalOpen}
          contentLabel="Add Call Back"
          className="add-note-modal"
        >
          <div className="add-note-modal__title">
            <h3>Add Case Note</h3>
          </div>
          <hr />
          <div className="add-note-modal__body">
            <Label text="Note:" />
            <Form>
              <TextArea
                name="noteText"
                value={this.state.noteText}
                onChange={this.handleChange}
                valid={this.validateItem("noteText").toString()}
              />
            </Form>
          </div>
          <hr />
          <div className="add-note-modal__footer">
            <ButtonContainer marginTop="20" justifyContent="flex-end">
              <Button content="Close" secondary onClick={this.closeModal} />
              <Button
                content={this.props.addNew ? "Add Note" : "Update Note"}
                primary
                onClick={this.validateNote}
              />
            </ButtonContainer>
          </div>
        </Modal>
      </div>
    );
  }
}
