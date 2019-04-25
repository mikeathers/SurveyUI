import React, { Component } from "react";

import ManageStopCaseReasons from "../ManageStopCaseReasons/ManageStopCaseReasons";
import AddStopCaseReason from "../AddStopCaseReason/AddStopCaseReason";

import { Row, Col } from "components/Common";

export default class StopCaseReasons extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stopCaseReasonsAdded: false
    };
  }
  stopCaseReasonsAdded = () => {
    this.setState({ stopCaseReasonsAdded: true });
  };
  render() {
    return (
      <Row>
        <Col lg={6} md={6} sm={12}>
          <Row>
            <Col sm={12}>
              <AddStopCaseReason
                stopCaseReasonsAdded={this.stopCaseReasonsAdded}
              />
            </Col>
          </Row>
        </Col>
        <Col lg={6} md={6} sm={12}>
          <Row>
            <Col sm={12}>
              <ManageStopCaseReasons
                stopCaseReasonsAdded={this.state.stopCaseReasonsAdded}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}
