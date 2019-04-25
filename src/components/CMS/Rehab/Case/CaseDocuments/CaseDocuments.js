import React, { Component } from "react";
import * as api from "api";
import { Card, FormRow } from "components/Common";
import "./CaseDocuments.scss";

const CaseDocument = ({ document, download }) => (
  <div className="case-document" onClick={download}>
    <p>{document.name}</p>
  </div>
);

class CaseDocuments extends Component {
  download = (path, name) => {
    api.downloadDocument(path).then(res => {
      var link = document.createElement("a");
      link.href = window.URL.createObjectURL(res.data);
      link.download = name;
      link.click();
    });
  };

  render() {
    return (
      <Card title="Case Documents">
        {this.props.documents !== undefined &&
        this.props.documents.length > 0 ? (
          this.props.documents.map((document, key) => (
            <CaseDocument
              document={document}
              key={key}
              download={() => this.download(document.path, document.name)}
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

export default CaseDocuments;
