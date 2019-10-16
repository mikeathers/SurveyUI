import React from "react";

import { Card } from "components/Common";

import "./PainKillers.scss";

const PainKillers = ({ currentPainKillers }) => {
  return (
    <Card title="Current Pain Killers" id="soapSurveyPainKillers">
      <div className="soap-survey-pain-killers">
        <div className="soap-survey-pain-killers__item">
          {currentPainKillers.standardPainKillers.map((painKiller, key) => {
            const withComma =
              key === currentPainKillers.standardPainKillers.length - 1
                ? `${painKiller}`
                : `${painKiller},`;

            return (
              <p id="soapSurveyPainKiller" key={key}>
                {withComma}
              </p>
            );
          })}
        </div>
        {currentPainKillers.other !== "" && (
          <div id="soapSurveyOtherPainKillers">
            <p className="strong">Other:</p>
            <p>{currentPainKillers.other}</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default PainKillers;
