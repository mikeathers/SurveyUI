import * as api from "api";
import { injuredPartyDetailsForDocument } from "./util";

export const createHtmlEmailTemplate = (html, bluedogCaseValues) => {
  const valuesFromContent = html.split(/[{{}}]/);
  const parsedValues = valuesFromContent
    .map(c => {
      if (c !== "" && !c.includes(">")) return c;
      else return null;
    })
    .filter(m => m !== undefined);

  parsedValues.forEach(x => {
    const valueToFind = `{{${x}}}`;

    const startValueIndex = html.search(valueToFind);
    const endValueIndex = html.indexOf("}}", startValueIndex);
    const length = endValueIndex - startValueIndex + 2;

    const openTagOpen = html.lastIndexOf("<a", startValueIndex);
    const openTagClose = html.lastIndexOf(">", startValueIndex);
    const openTagLength = openTagClose - openTagOpen + 1;

    const closeTagOpen = html.indexOf("<", startValueIndex);
    const closeTagClose = html.indexOf(">", startValueIndex);
    const closeTagLength = closeTagClose - closeTagOpen + 1;

    const searchString = html.substr(startValueIndex, length);
    const openTag = html.substr(openTagOpen, openTagLength);
    const closeTag = html.substr(closeTagOpen, closeTagLength);

    if (searchString !== "" && openTag !== "" && closeTag !== "<p>") {
      html = html.replace(openTag, "");
      html = html.replace(closeTag, "");
    }

    Object.keys(bluedogCaseValues).forEach(key => {
      if (x === key) {
        html = html.replace(valueToFind, bluedogCaseValues[key]);
      }
    });
  });
  return html;
};

export const getEmailTemplate = async (
  emailTemplateRequest,
  toEmailAddress,
  fromEmailAddress,
  bluedogCaseValues
) => {
  const getEmailTemplateResult = await api.getEmailTemplate(
    emailTemplateRequest
  );
  if (getEmailTemplateResult !== undefined) {
    if (getEmailTemplateResult.status === 200) {
      const emailTemplate = getEmailTemplateResult.data;
      const emailContent = createHtmlEmailTemplate(
        emailTemplate.content,
        bluedogCaseValues
      );
      const emailToSend = {
        body: emailContent,
        subject: emailTemplate.subject,
        from: fromEmailAddress,
        to: toEmailAddress,
        emailTemplate
      };
      return emailToSend;
    }
  }
};

export const createLetterDocument = async documentToCreate => {
  const response = await api.createLetterDocument(documentToCreate);
  if (response !== undefined) {
    if (response.status === 200) {
      const letterPath = response.data;
      return [letterPath];
    } else {
      const errors = {
        errorMessages: response.data.errors.map(m => m.errorMessage),
        serviceName: "DocumentBuilder",
        functionName: "CreateDocument",
        actionedBy: this.props.user.name
      };
      api.logErrors(errors);
    }
  }
};

export const sendEmail = async emailToSend => {
  const sendEmailResult = await api.sendEmail(emailToSend);
  if (sendEmailResult !== undefined)
    return sendEmailResult.status === 200 ? true : false;
};

export async function emailInjuredParty(
  systemActivity,
  emailTemplateName,
  bluedogCaseValues,
  surveyDocument,
  updateActivity
) {
  const emailTemplateRequest = {
    emailTemplateName,
    actionedBy: this.props.username
  };

  let systemActivityId;

  if (updateActivity)
    await this.updateSystemActivity(systemActivity.systemActivityId, "Pending");

  if (!updateActivity) {
    systemActivityId = await this.addSystemActivity(
      systemActivity.activity,
      systemActivity.type,
      systemActivity.state,
      emailTemplateName,
      systemActivity.bluedogActionName,
      systemActivity.surveyDocumentNeedsSending,
      "Injured Party"
    );
  }

  const toEmailAddress = bluedogCaseValues.InjuredPartyEmail;
  const fromEmailAddress = "mi3d@3drehab.co.uk";

  const emailToSendDetails = await getEmailTemplate(
    emailTemplateRequest,
    toEmailAddress,
    fromEmailAddress,
    bluedogCaseValues
  );

  const documentToCreate = {
    templateName: emailToSendDetails.emailTemplate.letterTemplate.fileName,
    ...bluedogCaseValues
  };

  let attachments = await createLetterDocument(documentToCreate);

  if (surveyDocument !== null && surveyDocument !== undefined)
    attachments = [...attachments, surveyDocument];

  const emailToSend = {
    ...emailToSendDetails,
    attachments
  };

  const emailDocumentToCreate = {
    text: emailToSendDetails.body,
    name: `${this.props.mi3dCase.caseId}__${systemActivity.activity}`
  };

  const sentEmailContent = await api.createEmailDocument(emailDocumentToCreate);

  attachments = [...attachments, sentEmailContent.data];

  const emailSent = await sendEmail(emailToSend);

  if (emailSent) {
    if (updateActivity) {
      await this.updateSystemActivity(
        systemActivity.systemActivityId,
        "Success"
      );
    } else await this.updateSystemActivity(systemActivityId, "Success");
    const emailToSave = {
      caseId: this.props.mi3dCase.caseId,
      name: systemActivity.activity,
      sentTo: emailToSendDetails.emailTemplate.sendTo,
      attachments: attachments.map((attachment, key) => ({
        name: `Attachment ${++key}`,
        path: attachment
      }))
    };
    const emailSaved = await api.saveEmail(emailToSave);
    if (emailSaved) this.props.updateMi3dCase(emailSaved.data);
  } else {
    if (updateActivity) {
      await this.updateSystemActivity(systemActivity.systemActivityId, "Error");
    } else await this.updateSystemActivity(systemActivityId, "Error");
  }
}

export async function emailInstructingParty(
  systemActivity,
  emailTemplateName,
  bluedogCaseValues,
  surveyDocument,
  updateActivity
) {
  const emailTemplateRequest = {
    emailTemplatename: emailTemplateName,
    actionedBy: this.props.username
  };

  let systemActivityId;

  if (updateActivity)
    await this.updateSystemActivity(systemActivity.systemActivityId, "Pending");

  if (!updateActivity) {
    systemActivityId = await this.addSystemActivity(
      systemActivity.activity,
      systemActivity.type,
      systemActivity.state,
      emailTemplateName,
      systemActivity.bluedogActionName,
      systemActivity.surveyDocumentNeedsSending,
      "Instructing Party"
    );
  }

  const toEmailAddress = bluedogCaseValues.InstructingPartyEmail;
  const fromEmailAddress = "rehab.mail@3drehab.co.uk";

  const emailToSendDetails = await getEmailTemplate(
    emailTemplateRequest,
    toEmailAddress,
    fromEmailAddress,
    bluedogCaseValues
  );

  const documentToCreate = {
    templateName: emailToSendDetails.emailTemplate.letterTemplate.fileName,
    ...bluedogCaseValues
  };

  let attachments = await createLetterDocument(documentToCreate);

  if (surveyDocument !== null && surveyDocument !== undefined)
    attachments = [...attachments, surveyDocument];

  const emailToSend = {
    ...emailToSendDetails,
    attachments
  };

  const emailDocumentToCreate = {
    text: emailToSendDetails.body,
    name: `${this.props.mi3dCase.caseId}__${systemActivity.activity}`
  };

  const sentEmailContent = await api.createEmailDocument(emailDocumentToCreate);

  attachments = [...attachments, sentEmailContent.data];

  const emailSent = await sendEmail(emailToSend);

  if (emailSent) {
    if (updateActivity) {
      await this.updateSystemActivity(
        systemActivity.systemActivityId,
        "Success"
      );
    } else await this.updateSystemActivity(systemActivityId, "Success");
    const emailToSave = {
      caseId: this.props.mi3dCase.caseId,
      name: systemActivity.activity,
      sentTo: emailToSendDetails.emailTemplate.sendTo,
      attachments: attachments.map((attachment, key) => ({
        name: `Attachment ${++key}`,
        path: attachment
      }))
    };
    const emailSaved = await api.saveEmail(emailToSave);
    if (emailSaved) this.props.updateMi3dCase(emailSaved.data);
  } else {
    if (updateActivity) {
      await this.updateSystemActivity(systemActivity.systemActivityId, "Error");
    } else await this.updateSystemActivity(systemActivityId, "Error");
  }
}

export function getBluedogInjuredPartyValues(bluedogCase) {
  const bluedogCaseValues = injuredPartyDetailsForDocument(bluedogCase);
  this.setState({ bluedogCaseValues });
}
