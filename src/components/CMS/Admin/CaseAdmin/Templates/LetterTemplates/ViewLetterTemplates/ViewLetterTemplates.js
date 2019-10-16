import React, { Component } from "react";
import _ from "lodash";
import * as api from "api";
import {withErrorHandling} from "HOCs";
import { Card, FormRow } from "components/Common";

import "./ViewLetterTemplates.scss";

const LetterTemplate = ({ document, handleDownloadFile }) => (
  <div className="letter-template" onClick={handleDownloadFile}>
    <p>{document.name}</p>
  </div>
);

class ViewLetterTemplates extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      letterTemplates: []
    };
  }

  componentDidMount() {
    this._isMounted = true;
    this.getLetterTemplates();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentWillReceiveProps({ letterTemplates }) {
    if (letterTemplates !== undefined && letterTemplates.length > 0) {
      this.setState({ letterTemplates });
    }
  }

  handleDownloadFile = async (path, name) => {
    const downloadLetterTemplateResult = await api.downloadLetterTemplate(path);
    var link = document.createElement("a");
    link.href = window.URL.createObjectURL(downloadLetterTemplateResult.data);
    link.download = name;
    link.click();
  };

  getLetterTemplates = async () => {
    const response = await api.getLetterTemplates();
    if (response !== undefined) {
      if (this._isMounted && response.status === 200) {
        const letterTemplates = _.orderBy(response.data, "name");
        this.setState({ letterTemplates });
      }
    } else this.props.showErrorModal();
  };

  render() {
    return (
      <Card title="View Letter Templates">
        <div className="case-activity scrollable-card--large">
          {this.state.letterTemplates !== undefined &&
          this.state.letterTemplates.length > 0 ? (
            this.state.letterTemplates.map((template, key) => (
              <LetterTemplate
                document={template}
                key={key}
                handleDownloadFile={() =>
                  this.handleDownloadFile(template.path, template.name)
                }
              />
            ))
          ) : (
            <FormRow>
              <p className="light">No documents have been completed..</p>
            </FormRow>
          )}
        </div>
      </Card>
    );
  }
}

export default withErrorHandling(ViewLetterTemplates);
