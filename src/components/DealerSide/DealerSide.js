import React from "react";
import { sumHand } from "../../utils";
import Hand from "../Hand/Hand";
import "./DealerSide.scss";

const DealerSide = ({ dealerHand }) => (
  <div className="dealer-side-wrapper">
    <Hand hand={dealerHand} score={sumHand(dealerHand)} />
  </div>
);

export default DealerSide;
