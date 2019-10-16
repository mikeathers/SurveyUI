import React from "react";

import "./ContactItem.scss";

const ContactItem = props => {
  const { contactNumberType, contactNumber, preferred, notes } = props.info;
  return (
    <div className="contact-item" onClick={props.updateContactInfo}>
      <div className="contact-item__type">
        {contactNumberType !== "Mobile" ? (
          <i className="fa fa-phone" />
        ) : (
          <i className="fa fa-mobile" />
        )}
      </div>
      <div className="contact-item__content">
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
          <p className="contact-item__notes">{notes}</p>
        </div>
      </div>
    </div>
  );
};

export default ContactItem;
