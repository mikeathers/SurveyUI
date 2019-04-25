export const initialKnockoutGiven = bluedogCase => {
  return (
    `<p>Hi ${bluedogCase.instructingParty.name}</p>` +
    `<p>${bluedogCase.firstName} ${
      bluedogCase.lastName
    } has responded with a knockout answer</p>` +
    `<p>Please find attached the initial survey document</p>` +
    `<p>Kind regards,</p>` +
    `<p>3d Rehabilitation</p>`
  );
};
