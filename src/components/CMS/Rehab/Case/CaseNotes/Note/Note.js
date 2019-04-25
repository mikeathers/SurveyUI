import React from "react";
import moment from "moment";
import "./Note.scss";

const Note = props => {
  return (
    <div className="casenote">
      <div className="casenote__note" onClick={props.openNote}>
        <p>{props.note.noteText}</p>
      </div>
      <div className="casenote__created" onClick={props.openNote}>
        <p>{moment(props.note.createdOn).format("DD/MM/YYYY hh:mm A")}</p>
        <p>{props.note.createdBy}</p>
      </div>
      <div className="casenote__close" onClick={props.showRemoveModal}>
        <p>x</p>
      </div>
    </div>
  );
};
export default Note;
