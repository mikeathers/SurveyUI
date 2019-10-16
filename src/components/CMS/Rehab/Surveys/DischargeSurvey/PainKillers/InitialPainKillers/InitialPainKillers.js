import React from "react";
import "./InitialPainKillers.scss";

const InitialPainKillers = ({ painKillers }) => {
  return (
    <div
      id="dischargeSurveyInitialPainKillers"
      className="discharge-survey-initial-pain-killers"
    >
      <p className="strong">Initial Pain Medication:</p>
      <div className="discharge-survey-initial-pain-killers__content">
        {painKillers.standardPainKillers !== undefined &&
        painKillers.standardPainKillers.length > 0 ? (
          painKillers.standardPainKillers.map((painKiller, key) => {
            return (
              <p key={key} id="dischargeSurveyInitialPainKiller">
                {painKiller !== "Other" && painKiller}
              </p>
            );
          })
        ) : (
          <p>None</p>
        )}
      </div>
      {painKillers.other !== "" && (
        <div id="dischargeSurveyOtherPainKillers">
          <p className="strong">Other:</p>
          <p>{painKillers.other !== undefined ? painKillers.other : "None"}</p>
        </div>
      )}
    </div>
  );
};

export default InitialPainKillers;
