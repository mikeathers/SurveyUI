import React from "react";
import { PageHeader, PageAction } from "components/Common";

const PageTopBar = ({ title, openDpaModal, openHoldModal, caseClosed }) => {
  return (
    <PageHeader title={title}>
      <PageAction
        actionName="Data Protection Act"
        triggerAction={openDpaModal}
      />

      <PageAction
        actionName="Stop The Case"
        triggerAction={openHoldModal}
        disabled={caseClosed}
      />
    </PageHeader>
  );
};

export default PageTopBar;
