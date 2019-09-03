import React from "react";
/*********
COMPONENTS
**********/
import BetInput from "../BetInput/BetInput";
import GameButton from "../GameButton/GameButton";
import ChipsTally from "../ChipsTally/ChipsTally";
import RigDeckCheckbox from "../RigDeckCheckbox/RigDeckCheckbox";

/************
UTIL FUNCTIONS
*************/
import { isEqual, cloneDeep } from "lodash";
import { isSplittableHand } from "../../utils";

/******
STYLES
*******/
import "./ControlPanel.scss";

const ControlPanel = ({
  deck,
  setDeck,
  bet,
  setBet,
  chips,
  setChips,
  playerHands,
  setPlayerHands,
  currentHand,
  setCurrentHand,
  turn,
  setTurn,
  gameOverNotification,
  outcomeNotification,
  toggleIsRiggedForSplits
}) => {
  //----------------------------------------------------------------//
  //                         HELPERS                                //
  //----------------------------------------------------------------//
  const hitPlayer = () => {
    //make copies
    const deckCopy = [...deck];
    const handsCopy = cloneDeep(playerHands);
    const currentHandCopy = cloneDeep(currentHand);

    //deal a new card to the current hand
    const newCard = deckCopy.pop();
    currentHandCopy.cards.push(newCard);

    //replace the old hand with the new hand
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
    const currentHandCopy = cloneDeep(currentHand);

    //replace the current hand with 2 split hands
    const currentHandIndex = playerHands.findIndex(hand =>
      isEqual(hand, currentHand)
    );
    handsCopy.splice(
      currentHandIndex,
      1,
      { cards: [currentHandCopy.cards[0]], bet },
      { cards: [currentHandCopy.cards[1]], bet }
    );

    //update state
    setCurrentHand(handsCopy[0]);
    setPlayerHands(handsCopy);
    setChips(chips => chips - bet);
  };

  const handleStand = () => {
    //make copies
    const handsCopy = cloneDeep(playerHands);

    //determine if it's the dealer's turn yet
    //or whether we still have more player hands
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

  const handleDoubleDown = () => {
    //make copies
    const deckCopy = [...deck];
    const handsCopy = cloneDeep(playerHands);
    const currentHandCopy = cloneDeep(currentHand);

    //deal only one additional card
    const newCard = deckCopy.pop();
    currentHandCopy.cards.push(newCard);

    //double the current bet
    currentHandCopy.bet *= 2;

    //update the state of current hand to reflect new bet and final card
    setCurrentHand(currentHandCopy);

    //decrement player chip count correspondingly
    setChips(chips => chips - currentHandCopy.bet);

    //get index of current hand in the player hand array
    const currentIndex = playerHands.findIndex(hand =>
      isEqual(hand, currentHand)
    );

    //update the player hands array with the updated hand
    handsCopy.splice(currentIndex, 1, currentHandCopy);
    setPlayerHands(handsCopy);

    //determine if it's the dealer's turn yet
    //or whether we still have more player hands
    const nextHand = handsCopy[currentIndex + 1];
    if (nextHand) {
      setCurrentHand(nextHand);
    } else {
      setTurn("dealer");
    }
  };

  return (
    <>
      <ChipsTally chips={chips} />
      {bet === 0 && (
        <>
          <BetInput setBet={setBet} chips={chips} setChips={setChips} />
          <RigDeckCheckbox toggleIsRiggedForSplits={toggleIsRiggedForSplits} />
        </>
      )}
      {turn === "player" &&
        !gameOverNotification &&
        !outcomeNotification &&
        bet > 0 && (
          <>
            <GameButton onClick={e => hitPlayer()} content="Hit" />
            <GameButton onClick={handleStand} content="Stand" />
            {(currentHand.cards.length === 2 ||
              currentHand.cards.length === 1) && (
              <GameButton onClick={handleDoubleDown} content="Double Down" />
            )}
            {isSplittableHand(currentHand) && (
              <GameButton onClick={handleSplit} content="Split" />
            )}
          </>
        )}
    </>
  );
};

export default ControlPanel;
