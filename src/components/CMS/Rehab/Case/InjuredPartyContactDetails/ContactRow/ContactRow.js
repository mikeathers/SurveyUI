import React from "react";
import "./ContactRow.scss";

const ContactRow = props => {
  const { contactNumberType, contactNumber, preferred, notes } = props.info;
  return (
    <tr className="contact-row">
      <td onClick={props.updateContactInfo}>
        <p>{contactNumberType}</p>
      </td>
      <td onClick={props.updateContactInfo}>
        <p>{contactNumber}</p>
      </td>
      <td onClick={props.updateContactInfo}>
        <p>{preferred === "Y" ? "Yes" : "No"}</p>
      </td>
      <td>
        <p>{notes}</p>
        <span onClick={props.showRemoveModal} className="contact-row__close">
          <p>x</p>
        </span>
      </td>
    </tr>
  );
};

export default ContactRow;
