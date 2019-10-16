import React, { Component } from "react";
import _ from "lodash";
import * as api from "api";
import {withErrorHandling} from "HOCs";
import CaseNotesModal from "./CaseNotesModal/CaseNotesModal";
import Note from "./Note/Note";

import {
  Card,
  Button,
  Message,
  Modal,
  ButtonContainer
} from "components/Common";

import "./CaseNotes.scss";

class CaseNotes extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      addNew: true,
      selectedNote: null,
      showMessage: false,
      errorMessage: false,
      removeModalOpen: false,
      addNoteModalOpen: false
    };
  }

  componentWillMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  closeAddNoteModal = () => {
    this.setState({ addNoteModalOpen: false });
  };

  openAddNoteModal = () => {
    this.setState({ addNoteModalOpen: true, addNew: true });
  };

  openNote = note => {
    this.setState({
      selectedNote: note,
      addNoteModalOpen: true,
      addNew: false
    });
  };

  caseNote = noteText => ({
    noteText,
    party: "System",
    rehabUser: "Mi3D",
    type: "Case Activity",
    direction: "Internal",
    createdBy: this.props.username,
    caseId: this.props.mi3dCase.caseId,
    actionedBy: this.props.username,
    bluedogCaseRef: this.props.bluedogCase.bluedogCaseRef
  });

  createNote = async noteText => {
    const response = await api.createCaseNote(this.caseNote(noteText));
    if (response !== undefined) {
      if (response.status === 200) {
        this.props.updateMi3dCase(response.data);
        this.showSuccessMessage("Note has been created successfully");
      } else this.showErrorMessage(response.data[0].errorMessage);
    } else this.props.showErrorModal();
  };

  updateNote = async noteText => {
    const response = await api.updateCaseNote(this.caseNote(noteText));
    if (response !== undefined) {
      if (response.status === 200) {
        this.props.updateMi3dCase(response.data);
        this.showSuccessMessage("Note has been updated successfully");
      } else this.showErrorMessage(response.data[0].errorMessage);
    } else this.props.showErrorModal();
  };

  openRemoveNoteModal = () => {
    this.setState({ removeModalOpen: true });
  };

  removeNote = async () => {
    const response = await api.removeCaseNote(this.caseNote(""));
    if (response !== undefined) {
      if (response.status === 200) {
        this.props.updateMi3dCase(response.data);
        this.showSuccessMessage("Note removed successfully");
      } else this.showErrorMessage(response.data[0].errorMessage);
    } else this.props.showErrorModal();
  };

  showSuccessMessage = message => {
    this._isMounted &&
      this.setState({
        message,
        showMessage: true,
        selectedNote: null,
        errorMessage: false,
        addNoteModalOpen: false,
        removeModalOpen: false
      });
    setTimeout(() => this.setState({ showMessage: false }), 3000);
  };

  showErrorMessage = message => {
    this._isMounted &&
      this.setState({
        message,
        showMessage: true,
        errorMessage: true
      });
    setTimeout(() => this.setState({ showMessage: false }), 3000);
  };

  render() {
    const caseNotes = _.orderBy(
      this.props.mi3dCase.caseNotes,
      [m => m.createdOn],
      ["desc"]
    );
    return (
      <Card title="Case Notes" collapsible={false} openByDefault={false}>
        <div className="scrollable-card">
          {caseNotes != null && caseNotes.length > 0 ? (
            caseNotes.map((note, key) => <Note note={note} key={key} />)
          ) : (
            <p className="light">No notes have been added..</p>
          )}
        </div>
        <ButtonContainer marginTop={15} justifyContent="flex-end">
          <Message
            show={this.state.showMessage}
            error={this.state.errorMessage}
            message={this.state.message}
            marginRight={45}
          />
          <Button
            content="Add a note"
            primary
            onClick={this.openAddNoteModal}
          />
        </ButtonContainer>
        <CaseNotesModal
          isModalOpen={this.state.addNoteModalOpen}
          closeModal={this.closeAddNoteModal}
          createNote={this.createNote}
          note={this.state.selectedNote}
          addNew={this.state.addNew}
          updateNote={this.updateNote}
          openRemoveNoteModal={() => this.openRemoveNoteModal()}
        />
        <Modal
          isModalOpen={this.state.removeModalOpen}
          title="Remove Case Note"
          message="Are you sure you want to remove this note?"
        >
          <ButtonContainer justifyContent="flex-end">
            <Button
              content="Close"
              secondary
              onClick={() => this.setState({ removeModalOpen: false })}
            />
            <Button content="Remove" type="danger" onClick={this.removeNote} />
          </ButtonContainer>
        </Modal>
      </Card>
    );
  }
}

export default withErrorHandling(CaseNotes);
