import React from "react";
import { isEqual } from "lodash";
import { sumHand } from "../../utils";
import Card from "../Card/Card";
import "./Hand.scss";

const Hand = ({ hand, score, currentHand, turn }) => (
  <div className="hand-wrapper">
    {<div className="scorebox">{turn !== "player" ? score : "??"}</div>}
    <div
      className={
        isEqual(currentHand, hand) ? "cards-wrapper selected" : "cards-wrapper"
      }
    >
      {turn === "player" ? (
        <>
          <Card card={hand.cards[0]} /> <Card card="blue_back" />
        </>
      ) : (
        hand.cards.map(card => <Card key={card} card={card} />)
      )}
    </div>
    {sumHand(hand) > 21 && <p className="busted-message">BUSTED</p>}
    {sumHand(hand) === 21 && hand.cards.length === 2 && hand.bet && (
      <p className="blackjack-message">BLACKJACK!</p>
    )}
    {sumHand(hand) === 21 && hand.cards.length > 2 && (
      <p className="blackjack-message">21! 21! 21!</p>
    )}
  </div>
);

export default Hand;
