import React from "react";
import "./OutcomeNotification.scss";

const OutcomeNotification = ({ outcomeNotification, resetStateForNewHand }) => (
  <div className="outcome-notification-wrapper">
    <p className="outcome-notification">{outcomeNotification}</p>
    <button
      className="outcome-notification-button"
      onClick={resetStateForNewHand}
    >
      Deal 'er again please
    </button>
  </div>
);

export default OutcomeNotification;
