import React, { useEffect, useState } from "react";
import PlayerSide from "./components/PlayerSide/PlayerSide";
import DealerSide from "./components/DealerSide/DealerSide";
import ControlPanel from "./components/ControlPanel/ControlPanel";
import { cloneDeep, isEqual } from "lodash";
import {
  generateShuffledDeck,
  sumHand,
  rigGameForSplits,
  isWin,
  isTie
} from "./utils";
import "./App.scss";

const App = () => {
  const [deck, setDeck] = useState([]);
  const [chips, setChips] = useState(1000);
  const [bet, setBet] = useState(0);
  const [turn, setTurn] = useState("player");
  const [dealerHand, setDealerHand] = useState({ cards: [] });
  const [isDouble, toggleDouble] = useState(false);
  const [isInsured, toggleIsInsured] = useState(false);
  //playerHands plural because of the possibility of splitting
  const [playerHands, setPlayerHands] = useState([]);
  //if there are multiple hands due to a split, currentHand
  //refers to the one which the player makes decisions on currently
  const [currentHand, setCurrentHand] = useState({ cards: [] });
  //stacks the deck for splitting as many as 3 times
  //to test the functionality/logic involved in splitting
  const [isRiggedForSplits, setIsRiggedForSplits] = useState(true);
  useEffect(() => {
    if (bet > 0 && !playerHands.length) dealCards();
  }, [bet]);

  useEffect(() => {
    if (sumHand(currentHand) >= 21) {
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
      const playerHand = {
        cards: [shuffledDeck.pop(), shuffledDeck.pop()],
        bet
      };
      const dealerHand = { cards: [shuffledDeck.pop(), shuffledDeck.pop()] };
      setDeck(shuffledDeck);
      setPlayerHands([playerHand]);
      setCurrentHand(playerHand);
      setDealerHand(dealerHand);
    }
  };

  const determineOutcome = () => {
    // const dealerScore = sumHand(dealerHand);
    // const playerScores = playerHands.map(({ cards }) => sumHand(cards));
    // const length = playerHands.length;
    // const wins = playerScores.filter(
    //   score =>
    //     (score <= 21 && dealerScore > 21) ||
    //     (score <= 21 && score > dealerScore)
    // ).length;
    // const ties = playerScores.filter(
    //   score => (score > 21 && dealerScore > 21) || score === dealerScore
    // ).length;
    // const chipsWon = (wins * bet * 2) / length + (ties * bet) / length;
    const totalChipsWon = playerHands.reduce((totalChipsWon, playerHand) => {
      return isWin(playerHand, dealerHand)
        ? totalChipsWon + playerHand.bet * 2
        : isTie(playerHand, dealerHand)
        ? totalChipsWon + playerHand.bet
        : totalChipsWon;
    }, 0);
    setChips(chips => chips + totalChipsWon);
    resetStateForNewHand();
  };

  const resetStateForNewHand = () => {
    setBet(0);
    setPlayerHands([]);
    setCurrentHand({ cards: [], bet: 0 });
    setDealerHand({ cards: [] });
    setDeck([]);
    setTurn("player");
  };

  useEffect(() => {
    if (turn === "dealer" && sumHand(dealerHand) < 17) {
      hitDealer();
    }
  }, [turn, dealerHand]);

  const hitDealer = () => {
    const deckCopy = [...deck];
    const dealerHandCopy = cloneDeep(dealerHand);

    dealerHandCopy.cards.push(deckCopy.pop());
    setDealerHand(dealerHandCopy);
    setDeck(deckCopy);
  };

  useEffect(() => {
    console.log(dealerHand);
    if (
      turn === "dealer" &&
      dealerHand.cards.length &&
      sumHand(dealerHand) >= 17
    )
      determineOutcome();
  }, [turn, dealerHand]);

  useEffect(() => {
    if (playerHands.length && playerHands.every(hand => sumHand(hand) > 21)) {
      resetStateForNewHand();
    }
  }, [playerHands]);

  return (
    <div className="App">
      <section className="game-display-section">
        <PlayerSide playerHands={playerHands} chips={chips} />
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
          setIsRiggedForSplits={setIsRiggedForSplits}
        />
      </section>
    </div>
  );
};

export default App;
