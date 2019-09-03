import React, { useEffect, useState, useCallback } from "react";

/*********
COMPONENTS
**********/
import PlayerSide from "./components/PlayerSide/PlayerSide";
import DealerSide from "./components/DealerSide/DealerSide";
import GameOverNotification from "./components/GameOverNotification/GameOverNotification";
import OutcomeNotification from "./components/OutcomeNotification/OutcomeNotification";
import ControlPanel from "./components/ControlPanel/ControlPanel";

/************
UTIL FUNCTIONS
*************/
import { cloneDeep, isEqual } from "lodash";
import {
  generateShuffledDeck,
  sumHand,
  isWin,
  isTie,
  rigGameForSplits
} from "./utils";

/******
STYLES
*******/
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

  //notifications
  const [outcomeNotification, setOutcomeNotification] = useState("");
  const [gameOverNotification, setGameOverNotification] = useState("");

  // console.log({ deck });
  // console.log({playerHands})
  // console.log({ dealerHand });

  //----------------------------------------------------------------//
  //                        SIDE EFFECTS                            //
  //----------------------------------------------------------------//

  //if bet has been submitted and player has no hand dealt, deal cards
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
        const delayedSetTurn = setTimeout(() => setTurn("dealer"), 1000);
        return () => clearTimeout(delayedSetTurn);
      }
    }
  }, [currentHand]);

  //if it is the dealer's turn and the dealer's hand is less than 16,
  //hit the dealer. else it is time to determine the outcome
  useEffect(() => {
    if (turn === "dealer") {
      if (sumHand(dealerHand) < 17) {
        const delayedDeal = setTimeout(hitDealer, 1100);
        return () => clearTimeout(delayedDeal);
      } else return determineOutcome();
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

  //----------------------------------------------------------------//
  //                         HELPERS                                //
  //----------------------------------------------------------------//

  const dealCards = () => {
    //this is for the game mode where you are guaranteed to be dealt 4 2s in a row
    if (isRiggedForSplits) {
      rigTheDeckAndDeal();
    } else {
      const shuffledDeck = generateShuffledDeck();
      const newPlayerHand = {
        cards: [shuffledDeck.pop(), shuffledDeck.pop()],
        //we grab the base bet amount from global state but this
        //can be mutated later by doubling down or insurance
        //(insurance in future story)
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
    //then tally up accordingly
    const netChipsWon = playerHands.reduce((netChipsWon, playerHand) => {
      return isWin(playerHand, dealerHand)
        ? netChipsWon + playerHand.bet * 2
        : isTie(playerHand, dealerHand)
        ? netChipsWon + playerHand.bet
        : netChipsWon;
    }, 0);
    setChips(chips => chips + netChipsWon);
    //game over condition:
    //if player has 0 chips left and didn't win any chips this deal
    if (chips === 0 && netChipsWon === 0) {
      setGameOverNotification(
        "You have ZERO chips. You are crap out of luck 😊"
      );
    } else {
      const netBet = playerHands.reduce((netBet, { bet }) => netBet + bet, 0);
      const netGain = netChipsWon - netBet;
      const message =
        netGain > 0
          ? `You won ${netGain} chips`
          : netGain === 0
          ? "You broke even"
          : `You lost ${Math.abs(netGain)} chips`;
      setOutcomeNotification(message);
    }
  };

  const resetStateForNewHand = () => {
    setBet(0);
    setPlayerHands([]);
    setCurrentHand({ cards: [], bet: 0 });
    setDealerHand({ cards: [] });
    setDeck([]);
    setTurn("player");
    toggleIsRiggedForSplits(false);
    setOutcomeNotification("");
    setGameOverNotification("");
  };

  const hitDealer = useCallback(() => {
    if (playerHands.every(hand => sumHand(hand) > 21)) {
      determineOutcome();
    } else {
      //make copies
      const deckCopy = [...deck];
      const dealerHandCopy = cloneDeep(dealerHand);
      //deal card
      dealerHandCopy.cards.push(deckCopy.pop());
      //update state
      setDealerHand(dealerHandCopy);
      setDeck(deckCopy);
    }
  }, [deck]);

  const rigTheDeckAndDeal = () => {
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
  };

  //----------------------------------------------------------------//
  //                         RENDER                                 //
  //----------------------------------------------------------------//

  return (
    <div className="App">
      <section className="game-display-section">
        <PlayerSide playerHands={playerHands} currentHand={currentHand} />
        <DealerSide dealerHand={dealerHand} turn={turn} />
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
          gameOverNotification={gameOverNotification}
          outcomeNotification={outcomeNotification}
          toggleIsRiggedForSplits={toggleIsRiggedForSplits}
        />
      </section>
      {outcomeNotification && (
        <OutcomeNotification
          outcomeNotification={outcomeNotification}
          resetStateForNewHand={resetStateForNewHand}
        />
      )}
      {gameOverNotification && (
        <GameOverNotification
          gameOverNotification={gameOverNotification}
          resetStateForNewHand={resetStateForNewHand}
          setChips={setChips}
        />
      )}
    </div>
  );
};

export default App;
