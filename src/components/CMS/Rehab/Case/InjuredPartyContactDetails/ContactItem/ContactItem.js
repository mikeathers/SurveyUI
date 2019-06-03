import React from "react";

import "./ContactItem.scss";

const ContactItem = props => {
  const { contactNumberType, contactNumber, preferred, notes } = props.info;
  return (
    <div className="contact-item" onClick={props.updateContactInfo}>
      <div className="contact-item__fixed">
        <p>Type</p>
        <p>{contactNumberType}</p>
      </div>
      <div className="contact-item__fixed">
        <p>Number</p>
        <p>{contactNumber}</p>
      </div>
      <div className="contact-item__fixed">
        <p>Preferred</p>
        <p>{preferred === "Y" ? "Yes" : "No"}</p>
      </div>
      <div>
        <p>Notes</p>
        <p>{notes}</p>
      </div>
    </div>
  );
};

export default ContactItem;
