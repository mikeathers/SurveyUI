import React, { Component } from "react";
import * as api from "api";
import _ from "lodash";
import moment from "moment";
import {withErrorHandling} from "HOCs";
import {
  createInitialSurveyDocument,
  createClinicianSurveyDocument,
  createSOAPSurveyDocument,
  createDischargeSurveyDocument
} from "helpers/surveys";

import {
  emailInstructingParty,
  emailInjuredParty,
  getBluedogInjuredPartyValues
} from "helpers/email";

import { addSystemActivity, updateSystemActivity } from "helpers/util";

import { Card } from "components/Common";

import {
  SystemActivitySuccessful,
  SystemActivityPending,
  SystemActivityError
} from "./SystemActivity";

class SystemActivities extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bluedogCaseValues: []
    };
    this.getBluedogInjuredPartyValues = getBluedogInjuredPartyValues.bind(this);
    this.createInitialSurveyDocument = createInitialSurveyDocument.bind(this);
    this.createClinicianSurveyDocument = createClinicianSurveyDocument.bind(
      this
    );
    this.createSOAPSurveyDocument = createSOAPSurveyDocument.bind(this);
    this.addSystemActivity = addSystemActivity.bind(this);
    this.emailInstructingParty = emailInstructingParty.bind(this);
    this.emailInjuredParty = emailInjuredParty.bind(this);
    this.updateSystemActivity = updateSystemActivity.bind(this);
    this.createDischargeSurveyDocument = createDischargeSurveyDocument.bind(
      this
    );
  }

  componentDidMount() {
    this.getBluedogInjuredPartyValues(this.props.bluedogCase);
  }

  getCase = async caseId => {
    const response = await api.getCase(caseId);
    if (response !== undefined) {
      this.props.updateMi3dCase(response.data);
    } else this.props.showErrorModal();
  };

  renderActivity = (activity, key) => {
    if (activity.state === "Success") {
      return (
        <SystemActivitySuccessful
          key={key}
          activity={activity}
          retryAction={() => this.retryAction(activity)}
        />
      );
    }
    if (activity.state === "Pending")
      return (
        <SystemActivityPending
          key={key}
          activity={activity}
          retryAction={() => this.retryAction(activity)}
        />
      );

    if (activity.state === "Error")
      return (
        <SystemActivityError
          key={key}
          activity={activity}
          retryAction={() => this.retryAction(activity)}
        />
      );
  };

  retryAction = failedActivity => {
    if (failedActivity.type === "Document") {
      if (failedActivity.activity.includes("Initial")) {
        this.handleInitialSurvey(failedActivity);
        return;
      }
      if (failedActivity.activity.includes("Clinician")) {
        this.handleClinicianSurvey(failedActivity);
        return;
      }
      if (failedActivity.activity.includes("SOAP")) {
        this.handleSOAPSurvey(failedActivity);
        return;
      }
      if (failedActivity.activity.includes("Discharge")) {
        this.handleDischargeSurvey(failedActivity);
        return;
      }
    }
    if (failedActivity.type === "Email") {
      if (failedActivity.activity.includes("Confirming Mi3D Eligibility")) {
        this.handleClinicianSurveyEmails(failedActivity);
        return;
      }
      if (failedActivity.activity.includes("Clinician")) {
        this.handleClinicianSurveyEmails(failedActivity);
        return;
      }
      if (failedActivity.activity.includes("Discharge")) {
        this.handleDischargeSurveyEmails(failedActivity);
        return;
      }

      this.handleAllOtherEmails(failedActivity);
    }
    if (failedActivity.type === "Case") {
      this.handleCase(failedActivity);
    }
  };

  handleCase = async failedActivity => {
    if (failedActivity.bluedogActionName !== null) {
      await this.updateSystemActivity(
        failedActivity.systemActivityId,
        "Pending"
      );
      const response = await api[failedActivity.bluedogActionName](
        this.props.bluedogCase.bluedogCaseRef
      );
      if (response.status === 200)
        await this.updateSystemActivity(
          failedActivity.systemActivityId,
          "Success"
        );
      else
        await this.updateSystemActivity(
          failedActivity.systemActivityId,
          "Error"
        );
    }
  };

  handleInitialSurvey = async failedActivity => {
    try {
      const { mi3dCase } = this.props;
      const completedSurveyId =
        mi3dCase.completedInitialSurvey.completedInitialSurveyId;

      const completedInitialSurveyRequest = {
        completedSurveyId,
        actionedBy: this.props.username
      };

      const response = await api.getCompletedInitialSurvey(
        completedInitialSurveyRequest
      );

      if (response !== undefined) {
        if (response.status === 200) {
          const initialSurvey = response.data;
          await this.updateSystemActivity(
            failedActivity.systemActivityId,
            "Pending"
          );
          const surveyCreated = await this.createInitialSurveyDocument(
            initialSurvey.completedQuestions,
            initialSurvey.completedDate,
            this.state.bluedogCaseValues
          );
          if (surveyCreated)
            await this.updateSystemActivity(
              failedActivity.systemActivityId,
              "Success"
            );
          else
            await this.updateSystemActivity(
              failedActivity.systemActivityId,
              "Error"
            );
        }
      }
    } catch {
      this.props.showErrorModal();
    }
  };

  handleClinicianSurveyEmails = async failedActivity => {
    try {
      const documentPath = this.props.mi3dCase.caseDocuments.find(
        m => m.name === "Initial Survey"
      ).path;
      await this.emailInstructingParty(
        failedActivity,
        failedActivity.emailTemplateName,
        this.state.bluedogCaseValues,
        documentPath,
        true
      );
    } catch {
      this.props.showErrorModal();
    }
  };

  handleClinicianSurvey = async failedActivity => {
    try {
      const { mi3dCase } = this.props;
      const completedSurveyId =
        mi3dCase.completedClinicianSurvey.completedClinicianSurveyId;

      const completedClinicianSurveyRequest = {
        completedSurveyId,
        actionedBy: this.props.username
      };

      const response = await api.getCompletedClinicianSurvey(
        completedClinicianSurveyRequest
      );

      if (response !== undefined) {
        if (response.status === 200) {
          const clinicianSurvey = response.data;
          await this.updateSystemActivity(
            failedActivity.systemActivityId,
            "Pending"
          );
          const surveyCreated = await this.createClinicianSurveyDocument(
            clinicianSurvey,
            this.state.bluedogCaseValues
          );
          if (surveyCreated)
            await this.updateSystemActivity(
              failedActivity.systemActivityId,
              "Success"
            );
          else
            await this.updateSystemActivity(
              failedActivity.systemActivityId,
              "Error"
            );
        }
      }
    } catch {
      this.props.showErrorModal();
    }
  };

  handleSOAPSurvey = async failedActivity => {
    try {
      const { mi3dCase } = this.props;

      const completedSurveyId =
        mi3dCase.completedSOAPSurveys[mi3dCase.completedSOAPSurveys.length - 1]
          .completedSOAPSurveyId;

      const completedSOAPSurveyRequest = {
        completedSurveyId,
        actionedBy: this.props.username
      };

      const response = await api.getCompletedSOAPSurvey(
        completedSOAPSurveyRequest
      );

      if (response !== undefined) {
        if (response.status === 200) {
          const SOAPSurvey = response.data;

          const soapForm = {
            planText: SOAPSurvey.planText,
            actionedBy: this.props.username,
            completedBy: this.props.username,
            caseId: this.props.mi3dCase.caseId,
            analysisText: SOAPSurvey.analysisText,
            objectiveText: SOAPSurvey.objectiveText,
            subjectiveText: SOAPSurvey.subjectiveText
          };

          await this.updateSystemActivity(
            failedActivity.systemActivityId,
            "Pending"
          );
          const surveyCreated = await this.createSOAPSurveyDocument(
            soapForm,
            this.state.bluedogCaseValues,
            SOAPSurvey.completedDate
          );
          if (surveyCreated)
            await this.updateSystemActivity(
              failedActivity.systemActivityId,
              "Success"
            );
          else
            await this.updateSystemActivity(
              failedActivity.systemActivityId,
              "Error"
            );
        }
      }
    } catch {
      this.props.showErrorModal();
    }
  };

  handleDischargeSurvey = async failedActivity => {
    try {
      const { mi3dCase, username } = this.props;

      const completedSurveyId =
        mi3dCase.completedDischargeSurvey.completedDischargeSurveyId;

      const completedDischargeSurveyRequest = {
        completedSurveyId,
        actionedBy: username
      };

      const response = await api.getCompletedDischargeSurvey(
        completedDischargeSurveyRequest
      );

      if (response !== undefined) {
        if (response.status === 200) {
          const dischargeSurvey = response.data;
          const injuredPartyOccupation = mi3dCase.completedClinicianSurvey.completedQuestions.find(
            q => {
              if (q.questionText === "What is your occupation?") return q;
            }
          ).textAnswer;

          const painScoreQuestion = mi3dCase.completedInitialSurvey.completedQuestions.find(
            q => q.type === "scale"
          );

          const initialPainScore = painScoreQuestion.scaleAnswer;

          const dischargeSurveyDetails = {
            ...this.state.bluedogCaseValues,
            clinicianName: dischargeSurvey.completedBy,
            completedDate: dischargeSurvey.completedDate,
            clinicianHCPC: dischargeSurvey.clinicianHCPC,
            psfsActivities:
              dischargeSurvey.completedDischargeSurveyPSFSActivities,
            closingSummary: dischargeSurvey.closingSummary,
            compliant: dischargeSurvey.contactWithIPEstablished,
            currentPainScore: this.getCurrentPainScore(),
            initialPainScore: initialPainScore,
            ipDoesNotWork: dischargeSurvey.ipDoesNotWork,
            injuredPartyOccupation,

            hasResumedHobbies: dischargeSurvey.ipResumedHobbies,
            hasReturnedToWork: dischargeSurvey.ipReturnedToWork,

            numberOfPrescribedExercises: mi3dCase.numberOfPrescribedExercises,

            completedTreatmentPlan: dischargeSurvey.ipCompletedTreatmentPlan,

            painKillersInitiallyBeingTaken: this.checkIfPainKillersInitiallyBeingTaken(),
            painKillersCurrentlyBeingTaken:
              dischargeSurvey.completedDischargeSurveyPainKillers.length > 0,

            clinicianSurveyDate: moment(
              mi3dCase.completedClinicianSurvey.completedDate
            ).format("DD/MM/YYYY"),
            registerationDate: moment(mi3dCase.exerciseStartDate).format(
              "DD/MM/YYYY"
            ),
            soapCallDate:
              mi3dCase.completedSOAPSurvey !== null
                ? moment(mi3dCase.completedSOAPSurveys[0].completedDate).format(
                    "DD/MM/YYYY"
                  )
                : "Did not complete"
          };

          await this.updateSystemActivity(
            failedActivity.systemActivityId,
            "Pending"
          );
          const surveyCreated = await this.createDischargeSurveyDocument(
            dischargeSurveyDetails,
            dischargeSurvey.completedDate
          );
          if (surveyCreated)
            await this.updateSystemActivity(
              failedActivity.systemActivityId,
              "Success"
            );
          else
            await this.updateSystemActivity(
              failedActivity.systemActivityId,
              "Error"
            );
        }
      }
    } catch {
      this.props.showErrorModal();
    }
  };

  handleDischargeSurveyEmails = async failedActivity => {
    try {
      const documentPath = this.props.mi3dCase.caseDocuments.find(
        m => m.name === "Discharge Survey"
      ).path;
      await this.emailInstructingParty(
        failedActivity,
        failedActivity.emailTemplateName,
        this.state.bluedogCaseValues,
        documentPath,
        true
      );
    } catch {
      this.props.showErrorModal();
    }
  };

  handleAllOtherEmails = async failedActivity => {
    try {
      if (failedActivity.sendTo === "Instructing Party") {
        await this.emailInstructingParty(
          failedActivity,
          failedActivity.emailTemplateName,
          this.state.bluedogCaseValues,
          null,
          true
        );
      } else {
        await this.emailInjuredParty(
          failedActivity,
          failedActivity.emailTemplateName,
          this.state.bluedogCaseValues,
          null,
          true
        );
      }
    } catch {
      this.props.showErrorModal();
    }
  };

  getCurrentPainScore = () => {
    const painScores = this.props.mi3dCase.completedDischargeSurvey
      .completedDischargeSurveyVASScores;
    if (painScores.length > 0 && painScores[0].currentPainScore !== "") {
      return painScores[0].currentPainScore;
    }
    return 0;
  };

  checkIfPainKillersInitiallyBeingTaken = () => {
    const initialSurveyQuestions = this.props.mi3dCase.completedInitialSurvey
      .completedQuestions;

    const painKillerQuestion = initialSurveyQuestions.find(q => {
      if (q.questionText === "Are you taking pain killers??") return q;
      return null;
    });

    if (painKillerQuestion !== undefined) {
      return painKillerQuestion.answer === "Yes" ? true : false;
    }

    return false;
  };

  render() {
    const { activities } = this.props;

    return (
      <Card title="System Activities">
        <div className="scrollable-card">
          {activities !== undefined && activities.length > 0 ? (
            _.orderBy(activities, ["systemActivityId"], ["desc"]).map(
              (activity, key) => this.renderActivity(activity, key)
            )
          ) : (
            <p className="light">No system activities have been started...</p>
          )}
        </div>
      </Card>
    );
  }
}

export default withErrorHandling(SystemActivities);
