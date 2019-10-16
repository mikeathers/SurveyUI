import React from "react";
import { Card } from "components/Common";

const CompletedSurveyContent = () => (
  <Card title="Closing Statement">
    <div className="completed-survey__body">
      <p>Thank you for your answers and your time today</p>
      <p>
        {" "}
        The results indicate that you would benefit from a prescribed course of
        exercises with videos which are accessible online.
      </p>
      <p>Are you happy to proceed?</p>
      <p>
        <span className="strong">
          {" "}
          If the Injured Party does not want to proceed:{" "}
        </span>{" "}
        Offer the option to go and see a physiotherapist.
      </p>
      <p>
        <span className="strong">
          If IP does not want to see a physiotherapist or continue with Mi3D:
        </span>{" "}
        Select the Injured party declined treatment option button.
      </p>{" "}
      <p>
        <span className="strong">If Injured Party is happy to proceed:</span>{" "}
        You will receive an email from mi3d inviting you to register. All the
        instructions to access your exercise programme are explained in the
        email. You can access via an app or via the website.
      </p>
      <p>**Please check your SPAM folder also**</p>
      <p>
        We will be in contact with you in 10 days to see how you are progressing
        and again when your exercises are due to complete so that you can be
        successfully discharged from our care.
      </p>
      <p>
        If you have any questions at any time, then a Helpline is available,
        details are included in the registration email.
      </p>
      <p>
        **It is important that you log your progress on the mi3d app, as this
        will be monitored and fed back as part of your claim**{" "}
      </p>
      <p className="light">Capture the following in the Case Notes</p>
      <p>Can I also confirm your contact details to ensure they are correct?</p>
      <p>Can I confirm the best time to contact you please?</p>
      <p>Do you have any questions?</p>
    </div>
  </Card>
);

export default CompletedSurveyContent;
