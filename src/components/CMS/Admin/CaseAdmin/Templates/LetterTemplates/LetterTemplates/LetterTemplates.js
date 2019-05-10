import React, { Component } from "react";
import { connect } from "react-redux";

import AddLetterTemplate from "../AddLetterTemplate/AddLetterTemplate";
import ManageLetterTemplates from "../ManageLetterTemplates/ManageLetterTemplates";
import ViewLetterTemplates from "../ViewLetterTemplates/ViewLetterTemplates";
import { Row, Col } from "components/Common";

import "./LetterTemplates.scss";
class LetterTemplates extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTemplate: null,
      emailTemplates: [],
      letterTemplates: [],
      clearForm: false
    };
  }

  getLetterTemplates = letterTemplates => {
    this.setState({ letterTemplates });
  };

  render() {
    return (
      <Row>
        <Col lg={6} md={6} sm={12}>
          <Row>
            <Col sm={12}>
              <AddLetterTemplate
                getLetterTemplates={this.getLetterTemplates}
                username={this.props.username}
              />
            </Col>
          </Row>
          <Row>
            <Col sm={12}>
              <ManageLetterTemplates
                letterTemplates={this.state.letterTemplates}
                getLetterTemplates={this.getLetterTemplates}
                username={this.props.username}
              />
            </Col>
          </Row>
        </Col>
        <Col lg={6} md={6} sm={12}>
          <Row>
            <Col sm={12}>
              <ViewLetterTemplates
                letterTemplates={this.state.letterTemplates}
                username={this.props.username}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = state => ({
  username: state.auth.user.name
});
export default connect(mapStateToProps)(LetterTemplates);
