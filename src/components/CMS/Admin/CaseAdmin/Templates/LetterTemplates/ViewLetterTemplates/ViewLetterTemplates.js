import React, { Component } from "react";
import * as api from "api";
import { Card, FormRow } from "components/Common";

import "./ViewLetterTemplates.scss";

const LetterTemplate = ({ document, download }) => (
  <div className="letter-template" onClick={download}>
    <p>{document.name}</p>
  </div>
);

export default class ViewLetterTemplates extends Component {
  constructor(props) {
    super(props);
    this.state = {
      letterTemplates: []
    };
  }

  componentDidMount() {
    api.getLetterTemplates().then(res => {
      if (!res.hasErrors) {
        this.setState({ letterTemplates: res.result });
      }
    });
  }

  componentWillReceiveProps({ letterTemplates }) {
    if (letterTemplates !== undefined || letterTemplates.length > 0) {
      this.setState({ letterTemplates });
    }
  }

  download = (path, name) => {
    api.downloadLetterTemplate(path).then(res => {
      var link = document.createElement("a");
      link.href = window.URL.createObjectURL(res.data);
      link.download = name;
      link.click();
    });
  };

  render() {
    return (
      <Card title="View Letter Templates">
        {this.state.letterTemplates !== undefined &&
        this.state.letterTemplates.length > 0 ? (
          this.state.letterTemplates.map((template, key) => (
            <LetterTemplate
              document={template}
              key={key}
              download={() => this.download(template.path, template.name)}
            />
          ))
        ) : (
          <FormRow>
            <p className="light">No documents have been completed..</p>
          </FormRow>
        )}
      </Card>
    );
  }
}
