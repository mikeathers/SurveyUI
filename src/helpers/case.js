import * as api from "api";

export async function selectCase(openedCase) {
  showLoadingModal(this);
  await getCase(openedCase.caseId, this);
  const returnedCase = await getInjuredPartyDetails(
    openedCase.bluedogCaseRef,
    this
  );
  if (returnedCase !== undefined) goToCase(returnedCase.bluedogCaseRef, this);
}

export async function getCase(caseId, parent) {
  const response = await api.getCase(caseId);
  if (response !== undefined) {
    parent.props.updateMi3dCase(response.data);
  } else {
    parent.props.showErrorModal();
    hideLoadingModal(parent);
  }
}

export async function getInjuredPartyDetails(bluedogCaseRef, parent) {
  const response = await api.getInjuredPartyDetails(bluedogCaseRef);
  if (response !== undefined) {
    if (response.status === 200) {
      parent.props.selectBluedogCase(response.data);
      return response.data;
    } else {
      parent.props.showErrorModal();
      hideLoadingModal();
    }
  } else {
    parent.props.showErrorModal();
    hideLoadingModal(parent);
  }
}

export async function goToCase(bluedogCaseRef, parent) {
  parent.props.selectSecondaryItem("Cases");
  parent.props.history.push(`/cms/rehab/case/${bluedogCaseRef}`);
}

const showLoadingModal = parent => {
  parent.setState({ showLoadingModal: true });
};

const hideLoadingModal = parent => {
  parent.setState({ showLoadingModal: false });
};
