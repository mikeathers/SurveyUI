import React from "react";
import moment from "moment";
import { Form, TextArea } from "components/Common";
import "./Note.scss";

const Note = props => {
  return (
    <div className="casenote">
      <div className="casenote__note">
        <Form>
          <TextArea
            value={props.note.noteText}
            disabled
            className="casenote__note-text"
          />
        </Form>
      </div>
      <div className="casenote__created">
        <p>{moment(props.note.createdOn).format("DD/MM/YYYY HH:mm")}</p>
        <p>{props.note.createdBy}</p>
      </div>
    </div>
  );
};
export default Note;
