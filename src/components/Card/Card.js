import React from "react";
import "./Card.scss";

const Card = ({ card }) => {
  return (
    <img
      className={"card-img"}
      key={card}
      alt={card}
      src={`cards/${card}.png`}
    />
  );
};

export default Card;
