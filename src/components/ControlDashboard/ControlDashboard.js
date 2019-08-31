import React from "react";
import "./ControlDashboard.scss";
import { isSplittableHand } from "../../utils";
import { isEqual, cloneDeep } from "lodash";

const ControlDashboard = ({
  deck,
  setDeck,
  playerHands,
  setPlayerHands,
  currentPlayerHand,
  setCurrentPlayerHand
}) => {
  const hitPlayer = () => {
    //make copies
    const deckCopy = [...deck];
    const handsCopy = cloneDeep(playerHands);
    const currentHandCopy = [...currentPlayerHand];

    //deal a new card to the current hand
    const newCard = deckCopy.pop();
    currentHandCopy.push(newCard);

    //replace the old hand in the collection of player hands with the new hand
    const currentHandIndex = playerHands.findIndex(hand =>
      isEqual(hand, currentPlayerHand)
    );
    handsCopy.splice(currentHandIndex, 1, currentHandCopy);

    //update state
    setPlayerHands(handsCopy);
    setCurrentPlayerHand(currentHandCopy);
    setDeck(deckCopy);
  };

  const handleSplit = () => {
    //make copies
    const handsCopy = cloneDeep(playerHands);
    const currentHandCopy = [...currentPlayerHand];
    //split the hand and add them to the player hands array

    const currentHandIndex = playerHands.findIndex(hand =>
      isEqual(hand, currentPlayerHand)
    );
    handsCopy.splice(
      currentHandIndex,
      1,
      [currentHandCopy[0]],
      [currentHandCopy[1]]
    );
    console.log(handsCopy);
    console.log(currentHandCopy[0]);
    setCurrentPlayerHand([currentHandCopy[0]]);
    setPlayerHands(handsCopy);
  };

  return (
    <div className="control-dashboard-wrapper">
      <button>Bet</button>
      <button onClick={hitPlayer}>Hit</button>
      <button>Stand</button>
      <button>Double Down</button>
      {isSplittableHand(currentPlayerHand) && (
        <button onClick={handleSplit}>Split</button>
      )}
    </div>
  );
};

export default ControlDashboard;
