import React from "react";
import { isEqual } from "lodash";
import Card from "../Card/Card";
import "./Hand.scss";

const Hand = ({ hand, score, currentHand }) => (
  <div
    className={
      isEqual(currentHand, hand) ? "hand-wrapper selected" : "hand-wrapper"
    }
  >
    <div className="scorebox">{score}</div>
    <div className="cards-wrapper">
      {hand.cards.map(card => (
        <Card key={card} card={card} />
      ))}
    </div>
  </div>
);

export default Hand;
