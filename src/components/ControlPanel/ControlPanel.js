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
  const hitPlayer = (updatedHands = null, updatedCurrentHand = null) => {
    //make copies
    const deckCopy = [...deck];
    //we check for updatedHands because hitPlayer() gets invoked in the
    //doubledown() handler, which doesn't want to reference state but rather what
    //the new state will be
    //note: this is perhaps not very readable. i have comments about it.
    const handsCopy = cloneDeep(updatedHands ? updatedHands : playerHands);
    const currentHandCopy = cloneDeep(
      updatedCurrentHand ? updatedCurrentHand : currentHand
    );

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

    //replace the hand with 2 split hands
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
    const newBet = playerHands.reduce((newBet, { bet }) => newBet + bet);
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
    const handsCopy = cloneDeep(playerHands);

    //get index of current hand in the player hand array
    const currentIndex = playerHands.findIndex(hand =>
      isEqual(hand, currentHand)
    );

    //get bet amount to update
    const oldBetAmount = currentHand.bet;

    //update the individual hand's bet attribute
    const updatedHand = { ...currentHand, bet: currentHand.bet * 2 };

    setCurrentHand(updatedHand);
    //decrement player chip count correspondingly
    setChips(chips => chips - oldBetAmount);

    //update the player hands array with the updated hand
    handsCopy.splice(currentIndex, 1, updatedHand);
    setPlayerHands(handsCopy);

    //deal only one additional card for this hand
    hitPlayer(handsCopy, updatedHand);

    //determine whether there is/are additional player hand/s
    //or whether it is the dealer's turn now
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
