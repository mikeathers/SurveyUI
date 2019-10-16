import React, { Component } from "react";
import * as api from "api";
import _ from "lodash";
import {withErrorHandling} from "HOCs";
import { Card, FormRow } from "components/Common";
import "./Correspondence.scss";

const Email = ({ email, download }) => (
  <div className="correspondence" onClick={download}>
    <i className="fa fa-envelope" style={{ color: "#00AB66" }} />
    <p>{email.name}</p>
  </div>
);

class Correspondence extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emails: props.emails !== undefined ? props.emails : []
    };
  }

  componentWillReceiveProps({ emails }) {
    if (emails !== undefined) this.setState({ emails });
  }

  handleDownloadFile = async email => {
    email.attachments.forEach(async attachment => {
      const response = await api.downloadDocument(attachment.path);
      if (response !== undefined) {
        var link = document.createElement("a");
        link.href = window.URL.createObjectURL(response.data);
        link.download = email.name;
        link.click();
      } else this.props.showErrorModal();
    });
  };

  render() {
    return (
      <Card title="Correspondence">
        <div className="scrollable-card">
          {this.state.emails !== undefined && this.state.emails.length > 0 ? (
            _.orderBy(this.state.emails, "emailId", "desc").map(
              (email, key) => (
                <Email
                  email={email}
                  key={key}
                  download={() => this.handleDownloadFile(email)}
                />
              )
            )
          ) : (
            <FormRow>
              <p className="light">No emails have been sent...</p>
            </FormRow>
          )}
        </div>
      </Card>
    );
  }
}

export default withErrorHandling(Correspondence);
