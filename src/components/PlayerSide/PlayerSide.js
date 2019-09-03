import React from "react";
import Hand from "../Hand/Hand";
import { sumHand } from "../../utils";
import "./PlayerSide.scss";

const PlayerSide = ({ playerHands, currentHand }) => (
  <div className="player-side-wrapper">
    {playerHands.map(hand => (
      <Hand
        key={JSON.stringify(hand)}
        hand={hand}
        score={sumHand(hand)}
        currentHand={currentHand}
      />
    ))}
    <p className="player-label">PLAYER</p>
  </div>
);

export default PlayerSide;
