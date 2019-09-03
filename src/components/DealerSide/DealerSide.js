import React from "react";
import { sumHand } from "../../utils";
import Hand from "../Hand/Hand";
import "./DealerSide.scss";

const DealerSide = ({ dealerHand, turn }) => (
  <div className="dealer-side-wrapper">
    {dealerHand.cards.length > 0 && (
      <Hand hand={dealerHand} score={sumHand(dealerHand)} turn={turn} />
    )}
  </div>
);

export default DealerSide;
