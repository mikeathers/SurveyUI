import React, { Component } from "react";
import _ from "lodash";
import { connect } from "react-redux";
import { updateMi3dCase } from "actions";
import * as api from "api";

import CaseNotesModal from "./CaseNotesModal/CaseNotesModal";
import Note from "./Note/Note";

import {
  Card,
  ButtonContainer,
  Button,
  Message,
  Modal
} from "components/Common";

import "./CaseNotes.scss";

class CaseNotes extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      addNoteModalOpen: false,
      showMessage: false,
      message: "",
      selectedNote: null,
      addNew: true,
      removeModalOpen: false
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

  createNote = noteText => {
    const caseNote = {
      noteText,
      createdBy: this.props.user.name,
      caseId: this.props.mi3dCase.caseId,
      actionedBy: this.props.user.name
    };
    api.createCaseNote(caseNote).then(res => {
      if (!res.data.hasErrors) {
        this.props.updateMi3dCase(res.data.result);
        if (this._isMounted) {
          this.setState({
            showMessage: true,
            addNoteModalOpen: false
          });
          setTimeout(() => this.setState({ showMessage: false }), 3000);
        }
      } else {
        if (this._isMounted) {
          this.setState({
            showMessage: true,
            message: res.data.erros[0].errorMessage,
            addNoteModalOpen: false
          });
        }
      }
    });
  };

  updateNote = note => {
    const caseNote = {
      noteText: note,
      createdBy: this.props.user.name,
      caseId: this.props.mi3dCase.caseId,
      caseNoteId: this.state.selectedNote.caseNoteId,
      actionedBy: this.props.user.name
    };
    api.updateCaseNote(caseNote).then(res => {
      if (!res.data.hasErrors) {
        this.props.updateMi3dCase(res.data.result);
        if (this._isMounted) {
          this.setState({ showMessage: true, addNoteModalOpen: false });
          setTimeout(() => this.setState({ showMessage: false }), 3000);
        }
      } else {
        if (this._isMounted) {
          this.setState({
            showMessage: true,
            message: res.data.errors[0].errorMessage,
            addNoteModalOpen: false
          });
        }
      }
    });
  };

  openRemoveNoteModal = note => {
    this.setState({ selectedNote: note, removeModalOpen: true });
  };

  removeNote = () => {
    const caseNote = {
      caseId: this.props.mi3dCase.caseId,
      caseNoteId: this.state.selectedNote.caseNoteId,
      actionedBy: this.props.user.name
    };
    api.removeCaseNote(caseNote).then(res => {
      if (!res.data.hasErrors) {
        this.props.updateMi3dCase(res.data.result);
        if (this._isMounted) {
          this.setState({
            showMessage: true,
            removeModalOpen: false,
            selectedNote: {}
          });
          setTimeout(() => this.setState({ showMessage: false }), 3000);
        }
      } else {
        if (this._isMounted) {
          this.setState({
            showMessage: true,
            message: res.data.erros[0].errorMessage,
            removeModalOpen: false,
            selectedNote: {}
          });
        }
      }
    });
  };

  render() {
    const caseNotes = _.orderBy(
      this.props.mi3dCase.caseNotes,
      [m => m.createdOn],
      ["desc"]
    );
    return (
      <Card title="Case Notes" collapsible={false} openByDefault={false}>
        {caseNotes != null && caseNotes.length > 0 ? (
          caseNotes.map((note, key) => (
            <Note
              note={note}
              key={key}
              openNote={() => this.openNote(note)}
              showRemoveModal={() => this.openRemoveNoteModal(note)}
            />
          ))
        ) : (
          <p className="light">No notes have been added..</p>
        )}
        <ButtonContainer marginTop={15} justifyContent="flex-end">
          <Message
            show={this.state.showMessage}
            error={this.state.message !== ""}
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

const MapDispatchToProps = dispatch => ({
  updateMi3dCase: updatedCase => dispatch(updateMi3dCase(updatedCase))
});
const mapStateToProps = state => ({
  mi3dCase: state.case.mi3dCase,
  user: state.auth.user
});
export default connect(
  mapStateToProps,
  MapDispatchToProps
)(CaseNotes);
