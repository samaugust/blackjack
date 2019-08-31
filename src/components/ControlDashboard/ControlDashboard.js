import React from "react";
import "./ControlDashboard.scss";
import { isSplittableHand } from "../../utils";
import { isEqual, cloneDeep } from "lodash";

const ControlDashboard = ({
  deck,
  setDeck,
  playerHands,
  setPlayerHands,
  currentHand,
  setCurrentHand,
  turn,
  setTurn
}) => {
  const hitPlayer = () => {
    //make copies
    const deckCopy = [...deck];
    const handsCopy = cloneDeep(playerHands);
    const currentHandCopy = [...currentHand];

    //deal a new card to the current hand
    const newCard = deckCopy.pop();
    currentHandCopy.push(newCard);

    //replace the old hand in the collection of player hands with the new hand
    const currentHandIndex = playerHands.findIndex(hand =>
      isEqual(hand, currentHand)
    );
    handsCopy.splice(currentHandIndex, 1, currentHandCopy);

    //update state
    setPlayerHands(handsCopy);
    setCurrentHand(currentHandCopy);
    setDeck(deckCopy);
  };

  const handleSplit = () => {
    //make copies
    const handsCopy = cloneDeep(playerHands);
    const currentHandCopy = [...currentHand];

    //split the hand and add them to the player hands array
    const currentHandIndex = playerHands.findIndex(hand =>
      isEqual(hand, currentHand)
    );
    handsCopy.splice(
      currentHandIndex,
      1,
      [currentHandCopy[0]],
      [currentHandCopy[1]]
    );

    //set state
    setCurrentHand([currentHandCopy[0]]);
    setPlayerHands(handsCopy);
  };

  const handleStand = () => {
    const handsCopy = cloneDeep(playerHands);
    const currentIndex = playerHands.findIndex(hand =>
      isEqual(hand, currentHand)
    );
    const nextHand = handsCopy[currentIndex + 1];
    if (nextHand) {
      setCurrentHand(nextHand);
    } else {
      setTurn("dealer");
    }
  };

  return (
    <div className="control-dashboard-wrapper">
      <button>Bet</button>
      {turn === "player" && <button onClick={hitPlayer}>Hit</button>}
      <button onClick={handleStand}>Stand</button>
      <button>Double Down</button>
      {isSplittableHand(currentHand) && (
        <button onClick={handleSplit}>Split</button>
      )}
    </div>
  );
};

export default ControlDashboard;
