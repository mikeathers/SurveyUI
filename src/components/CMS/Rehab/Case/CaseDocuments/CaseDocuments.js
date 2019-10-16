import React, { Component } from "react";
import * as api from "api";
import {withErrorHandling} from "HOCs";
import { Card, FormRow } from "components/Common";
import "./CaseDocuments.scss";

const CaseDocument = ({ document, download }) => (
  <div className="case-document" onClick={download}>
    <i className="fa fa-file-text" style={{ color: "#00AB66" }} />
    <p>{document.name}</p>
  </div>
);

class CaseDocuments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      documents: props.documents !== undefined ? props.documents : []
    };
  }

  componentWillReceiveProps({ documents }) {
    if (documents !== undefined) this.setState({ documents });
  }

  handleDownloadFile = async (path, name) => {
    const downloadDocumentResult = await api.downloadDocument(path);
    if (downloadDocumentResult !== undefined) {
      var link = document.createElement("a");
      link.href = window.URL.createObjectURL(downloadDocumentResult.data);
      link.download = name;
      link.click();
    } else this.props.showErrorModal();
  };

  render() {
    return (
      <Card title="Case Documents">
        <div className="scrollable-card">
          {this.state.documents !== undefined &&
          this.state.documents.length > 0 ? (
            this.state.documents.map((document, key) => (
              <CaseDocument
                document={document}
                key={key}
                download={() =>
                  this.handleDownloadFile(document.path, document.name)
                }
              />
            ))
          ) : (
            <FormRow>
              <p className="light">No documents have been created...</p>
            </FormRow>
          )}
        </div>
      </Card>
    );
  }
}

export default withErrorHandling(CaseDocuments);
