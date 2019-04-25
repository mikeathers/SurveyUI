export const injuredPartyDetailsForDocument = bluedogCase => {
  let incidentDate = "";
  if (bluedogCase.incidentDate !== null)
    incidentDate = bluedogCase.incidentDate.slice(
      0,
      bluedogCase.incidentDate.lastIndexOf(" ")
    );

  return {
    InjuredPartyFirstName: bluedogCase.firstName,
    InjuredPartyLastName: bluedogCase.lastName,
    InjuredPartyAddress1: bluedogCase.address1,
    InjuredPartyAddress2: bluedogCase.address2,
    InjuredPartyAddress3: bluedogCase.address3,
    InjuredPartyAddress4: bluedogCase.address4,
    InjuredPartyPostCode: bluedogCase.postCode,
    BluedogCaseRef: bluedogCase.bluedogCaseRef,
    IncidentDate: incidentDate,

    InstructingPartyName: bluedogCase.instructingPartyName,
    InstructingPartyRef: bluedogCase.instructingPartyRef,
    InstructingPartyAddress1: bluedogCase.instructingParty.addressLine1,
    InstructingPartyAddress2: bluedogCase.instructingParty.addressLine2,
    InstructingPartyAddress3: bluedogCase.instructingParty.addressLine3,
    InstructingPartyAddress4: bluedogCase.instructingParty.addressLine4,
    InstructingPartyPostcode: bluedogCase.instructingParty.addressPostCode
  };
};
