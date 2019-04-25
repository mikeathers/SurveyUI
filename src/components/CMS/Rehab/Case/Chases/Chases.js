import React, { Component } from "react";
import { Card } from "components/Common";
export default class Chases extends Component {
  render() {
    return (
      <Card title="Chases" collapse={false} openByDefault={true}>
        <p className="light">No chases have been started...</p>
      </Card>
    );
  }
}
