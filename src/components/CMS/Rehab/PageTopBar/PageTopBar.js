import React, { Component } from "react";
import { PageHeader, PageAction } from "components/Common";
export default class PageTopBar extends Component {
  render() {
    return (
      <PageHeader title={this.props.title}>
        <PageAction
          actionName="Disclosure Statement"
          triggerAction={this.props.openDisclosureModal}
        />
        <PageAction
          actionName="Hold Case"
          triggerAction={this.props.openHoldModal}
        />
        <PageAction
          actionName="Close Case"
          triggerAction={this.props.openCloseModal}
        />
      </PageHeader>
    );
  }
}
