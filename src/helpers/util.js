import moment from "moment";
import * as api from "api";

export async function addSystemActivity(
  activity,
  type,
  state,
  emailTemplateName = null,
  bluedogActionName = null,
  surveyDocumentNeedsSending = false,
  sendTo = null
) {
  const systemActivity = {
    activity,
    type,
    state,
    sendTo,
    caseId: this.props.mi3dCase.caseId,
    emailTemplateName,
    bluedogActionName,
    surveyDocumentNeedsSending,
    timeCreated: new Date()
  };
  const response = await api.addSystemActivity(systemActivity);
  if (response.status === 200) {
    this.props.updateMi3dCase(response.data);
    return response.data.systemActivities.find(
      m => m.activity === systemActivity.activity
    ).systemActivityId;
  }
}

export async function updateSystemActivity(systemActivityId, state) {
  const systemActivity = {
    caseId: this.props.mi3dCase.caseId,
    state,
    systemActivityId
  };
  const response = await api.updateSystemActivity(systemActivity);
  if (response.status === 200) this.props.updateMi3dCase(response.data);
}

const formatDate = date => {
  if (date !== null && date !== undefined)
    return moment(date.slice(0, date.lastIndexOf(" "))).format("DD/MM/YYYY");
};

export const injuredPartyDetailsForDocument = bluedogCase => {
  let incidentDate = formatDate(bluedogCase.incidentDate);
  let dateOfBirth = formatDate(bluedogCase.dateOfBirth);

  if (
    bluedogCase !== null &&
    bluedogCase !== undefined &&
    bluedogCase.instructingParty !== undefined
  ) {
    return {
      InjuredPartyFullName: `${bluedogCase.firstName} ${bluedogCase.lastName}`,
      InjuredPartyFirstName: bluedogCase.firstName,
      InjuredPartyLastName: bluedogCase.lastName,
      InjuredPartyTitle: bluedogCase.title,
      InjuredPartyHouseNo: bluedogCase.houseNo,
      InjuredPartyEmail: bluedogCase.email,
      InjuredPartyAddress1: bluedogCase.address1,
      InjuredPartyAddress2: bluedogCase.address2,
      InjuredPartyAddress3: bluedogCase.address3,
      InjuredPartyAddress4: bluedogCase.address4,
      InjuredPartyPostCode: bluedogCase.postCode,
      InjuredPartyDateOfBirth: dateOfBirth,
      BluedogCaseRef: bluedogCase.bluedogCaseRef,
      IncidentDate: incidentDate,
      RehabTelNo: "0845 666777",
      ClinicianTelNo: "0854 99999",

      InstructingPartyName: bluedogCase.instructingParty.name,
      InstructingPartyRef: bluedogCase.instructingPartyRef,
      InstructingPartyEmail: bluedogCase.instructingParty.emailAddress,
      InstructingPartyAddress1: bluedogCase.instructingParty.addressLine1,
      InstructingPartyAddress2: bluedogCase.instructingParty.addressLine2,
      InstructingPartyAddress3: bluedogCase.instructingParty.addressLine3,
      InstructingPartyAddress4: bluedogCase.instructingParty.addressLine4,
      InstructingPartyPostcode: bluedogCase.instructingParty.addressPostCode
    };
  } else return null;
};
