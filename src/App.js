import React, { useEffect, useState, useCallback } from "react";
import PlayerSide from "./components/PlayerSide/PlayerSide";
import DealerSide from "./components/DealerSide/DealerSide";
import ControlPanel from "./components/ControlPanel/ControlPanel";
import { cloneDeep, isEqual } from "lodash";
import {
  generateShuffledDeck,
  sumHand,
  isWin,
  isTie,
  rigGameForSplits
} from "./utils";
import "./App.scss";

const App = () => {
  //----------------------------------------------------------------//
  //                      INITIAL STATE                             //
  //----------------------------------------------------------------//

  const [deck, setDeck] = useState([]);
  const [chips, setChips] = useState(1000);
  const [bet, setBet] = useState(0);
  const [turn, setTurn] = useState("player");
  const [dealerHand, setDealerHand] = useState({ cards: [] });
  //we can have multiple player hands due to splitting
  const [playerHands, setPlayerHands] = useState([]);
  //refers to the hand which the player makes decisions on currently
  const [currentHand, setCurrentHand] = useState({ cards: [], bet: 0 });
  //stacks the deck to test the functionality/logic involved in splitting
  const [isRiggedForSplits, toggleIsRiggedForSplits] = useState(false);

  const [outcomeNotification, setOutcomeNotification] = useState("");

  const [gameOverNotification, setGameOverNotification] = useState("");

  // console.log({ playerHands });
  // console.log({ dealerHand });

  //----------------------------------------------------------------//
  //                        SIDE EFFECTS                            //
  //----------------------------------------------------------------//

  //if bet has been submitted and player has no hand(s) dealt, deal cards
  useEffect(() => {
    if (bet > 0 && !playerHands.length) dealCards();
  }, [bet]);

  /*
  determines what to do if the current player hand "busts" (over 21)
  if it is the only hand or is the last hand of splitted hands,
  it is now the dealer's turn. otherwise, we move to the next player hand
  */
  useEffect(() => {
    if (
      sumHand(currentHand) >= 21 &&
      !playerHands.every(hand => sumHand(hand) > 21)
    ) {
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
    }
  }, [currentHand]);

  //if it is the dealer's turn and the dealer's hand is less than 16,
  //hit the dealer. else it is time to determine the outcome
  useEffect(() => {
    if (turn === "dealer") {
      if (sumHand(dealerHand) < 17) {
        const delayedDeal = setTimeout(hitDealer, 2000);
        return () => clearTimeout(delayedDeal);
      } else determineOutcome();
    }
  }, [turn, dealerHand]);

  /*
  checks to see whether every player hand is "busted" (over 21)
  if so, there is no need for the dealer to be dealt cards 
  and we move on to the next deal
  */
  useEffect(() => {
    if (playerHands.length && playerHands.every(hand => sumHand(hand) > 21)) {
      determineOutcome();
    }
  }, [playerHands]);

  useEffect(() => {
    if (outcomeNotification) {
      const delayClearing = setTimeout(() => setOutcomeNotification(""), 9000);
      return () => clearTimeout(delayClearing);
    }
  }, [outcomeNotification]);

  //----------------------------------------------------------------//
  //                         HELPERS                                //
  //----------------------------------------------------------------//

  const dealCards = () => {
    if (isRiggedForSplits) {
      const {
        riggedDeck,
        dealerHand,
        riggedPlayerHands,
        riggedCurrentHand
      } = rigGameForSplits(bet);
      setDeck(riggedDeck);
      setDealerHand(dealerHand);
      setPlayerHands(riggedPlayerHands);
      setCurrentHand(riggedCurrentHand);
    } else {
      const shuffledDeck = generateShuffledDeck();
      const newPlayerHand = {
        cards: [shuffledDeck.pop(), shuffledDeck.pop()],
        bet
      };
      const newDealerHand = { cards: [shuffledDeck.pop(), shuffledDeck.pop()] };
      setDeck(shuffledDeck);
      setPlayerHands([newPlayerHand]);
      setCurrentHand(newPlayerHand);
      setDealerHand(newDealerHand);
    }
  };

  const determineOutcome = () => {
    //for every player hand, we determine whether it is a win or a tie
    //compared to the dealer's hand and tally up the chip returns accordingly
    const netChipsWon = playerHands.reduce((netChipsWon, playerHand) => {
      return isWin(playerHand, dealerHand)
        ? netChipsWon + playerHand.bet * 2
        : isTie(playerHand, dealerHand)
        ? netChipsWon + playerHand.bet
        : netChipsWon;
    }, 0);
    setChips(chips => chips + netChipsWon);
    if (chips === 0 && netChipsWon === 0)
      setGameOverNotification(
        "You have ZERO chips. You are shit out of luck 😊"
      );
    const netBet = playerHands.reduce((netBet, { bet }) => netBet + bet, 0);
    const netGain = netChipsWon - netBet;
    const message =
      netGain > 0
        ? `You won ${netGain} chips`
        : netGain === 0
        ? "You broke even"
        : `You lost ${Math.abs(netGain)} chips`;
    setOutcomeNotification(message);
    const delayResetting = setTimeout(resetStateForNewHand, 3000);
    return () => clearTimeout(delayResetting);
  };

  const resetStateForNewHand = () => {
    setBet(0);
    setPlayerHands([]);
    setCurrentHand({ cards: [], bet: 0 });
    setDealerHand({ cards: [] });
    setDeck([]);
    setTurn("player");
  };

  const hitDealer = useCallback(() => {
    //make copies
    const deckCopy = [...deck];
    const dealerHandCopy = cloneDeep(dealerHand);
    //deal card
    dealerHandCopy.cards.push(deckCopy.pop());
    //update state
    setDealerHand(dealerHandCopy);
    setDeck(deckCopy);
  }, [deck]);

  //----------------------------------------------------------------//
  //                         RENDER                                 //
  //----------------------------------------------------------------//

  return (
    <div className="App">
      <section className="game-display-section">
        <PlayerSide playerHands={playerHands} currentHand={currentHand} />
        <DealerSide dealerHand={dealerHand} />
      </section>
      <section className="control-panel-section">
        <ControlPanel
          deck={deck}
          setDeck={setDeck}
          bet={bet}
          setBet={setBet}
          chips={chips}
          setChips={setChips}
          playerHands={playerHands}
          setPlayerHands={setPlayerHands}
          currentHand={currentHand}
          setCurrentHand={setCurrentHand}
          turn={turn}
          setTurn={setTurn}
          toggleIsRiggedForSplits={toggleIsRiggedForSplits}
        />
      </section>
      {outcomeNotification && (
        <p className="outcome-notification">{outcomeNotification}</p>
      )}
      {gameOverNotification && (
        <p className="game-over-notification">{gameOverNotification}</p>
      )}
    </div>
  );
};

export default App;
