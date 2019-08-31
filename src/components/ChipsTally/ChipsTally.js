import React from "react";
import "./ChipsTally.scss";

const ChipsTally = ({ chips }) => (
  <div className="chips-wrapper">
    <div className="player-chips">Chips: {chips}</div>
  </div>
);

export default ChipsTally;
