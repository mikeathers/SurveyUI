import React from "react";
import DatePicker from "react-datepicker";
import moment from "moment";

import {
  Input,
  Form,
  Button,
  Message,
  TextArea,
  ButtonContainer
} from "components/Common";

const AddActivityForm = ({
  message,
  activity,
  painScore,
  showMessage,
  validateItem,
  handleChange,
  initialScoreDate,
  handleDateChange,
  validateAddActivity
}) => (
  <div className="psfsScore__table">
    <div className="psfsScore__table-header">
      <p>Activity</p>
      <p>Score</p>
      <p>Initial Score Date</p>
    </div>
    <Form className="psfsScore__form">
      <TextArea
        width="50"
        name="activity"
        marginright="20"
        value={activity}
        onChange={handleChange}
        id="psfsScoreActivitiesTextBox"
        valid={validateItem("activity").toString()}
      />
      <Input
        width="10"
        type="number"
        name="painScore"
        marginright="35"
        value={painScore}
        onChange={handleChange}
        id="psfsScoreScoreTextBox"
        valid={validateItem("painScore").toString()}
      />
      <DatePicker
        selected={new Date()}
        dateFormat="dd/MM/yyyy"
        id="psfsScoreDatePicker"
        onChange={handleDateChange}
        className="psfsScore__date-picker"
        value={moment(initialScoreDate).format("DD/MM/YYYY")}
      />
    </Form>

    <ButtonContainer justifyContent="flex-end">
      <Button
        primary
        content="Add Activity"
        onClick={validateAddActivity}
        id="psfsScoreAddActivityBtn"
      />
    </ButtonContainer>
    <Message
      error={true}
      marginTop="30"
      message={message}
      show={showMessage}
      id="psfsScoreMessage"
      justifyContent="flex-end"
    />
  </div>
);

export default AddActivityForm;
