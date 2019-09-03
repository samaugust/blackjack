import React from "react";
import "./GameOverNotification.scss";

const GameOverNotification = ({
  gameOverNotification,
  resetStateForNewHand,
  setChips
}) => (
  <div className="game-over-notification-wrapper">
    <p className="game-over-notification">{gameOverNotification}</p>
    <button
      className="game-over-notification-button"
      onClick={() => {
        resetStateForNewHand();
        setChips(1000);
      }}
    >
      Take a lean on your house
    </button>
  </div>
);

export default GameOverNotification;
