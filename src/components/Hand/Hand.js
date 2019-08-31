import React from "react";
import Card from "../Card/Card";
import "./Hand.scss";

const Hand = ({ hand, score }) => (
  <div className="hand-wrapper">
    <div className="scorebox">{score}</div>
    <div className="cards-wrapper">
      {hand.map(card => (
        <Card key={card} card={card} />
      ))}
    </div>
  </div>
);

export default Hand;
