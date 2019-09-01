import React from "react";
import "./GameButton.scss";

const GameButton = ({ onClick, content }) => (
  <div className="button-wrapper">
    <button onClick={onClick}>{content}</button>
  </div>
);

export default GameButton;
