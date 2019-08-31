import React, { useEffect, useState, useCallback } from "react";
import PlayerSide from "./components/PlayerSide/PlayerSide";
import DealerSide from "./components/DealerSide/DealerSide";
import ControlDashboard from "./components/ControlDashboard/ControlDashboard";
import { cloneDeep, isEqual } from "lodash";
import { generateShuffledDeck, sumHand } from "./utils";
import "./App.scss";

const App = () => {
  const [deck, setDeck] = useState([]);
  const [chips, setChips] = useState(1000);
  const [playerHands, setPlayerHands] = useState([]);
  const [currentHand, setCurrentHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [bet, setBet] = useState(0);
  const [isDouble, toggleDouble] = useState(false);
  const [isInsured, toggleIsInsured] = useState(false);
  const [turn, setTurn] = useState("player");

  const testMode = true;

  useEffect(() => {
    dealCards();
  }, []);

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
    if (testMode) {
      const mockPlayerHands = [["seven of clubs", "seven of hearts"]];
      const mockcurrentHand = ["seven of clubs", "seven of hearts"];
      const mockDealerHand = ["two of spades", "two of clubs"];
      const mockDeck = generateShuffledDeck().filter(
        card =>
          ![
            "seven of clubs",
            "seven of hearts",
            "seven of diamonds",
            "seven of spades",
            "two of spades",
            "two of clubs"
          ].includes(card)
      );
      mockDeck.push("seven of diamonds", "seven of spades");
      setDeck(mockDeck);
      setDealerHand(mockDealerHand);
      setPlayerHands(mockPlayerHands);
      setCurrentHand(mockcurrentHand);
    } else {
      const shuffledDeck = generateShuffledDeck();
      const playerHand = [shuffledDeck.pop(), shuffledDeck.pop()];
      const dealerHand = [shuffledDeck.pop(), shuffledDeck.pop()];
      setDeck(shuffledDeck);
      setPlayerHands([playerHand]);
      setCurrentHand(playerHand);
      setDealerHand(dealerHand);
    }
  };

  useEffect(() => {
    if (turn === "dealer" && sumHand(dealerHand) < 17) {
      hitDealer();
    }
  }, [turn, dealerHand]);

  const hitDealer = () => {
    const deckCopy = [...deck];
    const dealerHandCopy = [...dealerHand];
    dealerHandCopy.push(deckCopy.pop());
    setDealerHand(dealerHandCopy);
    setDeck(deckCopy);
  };

  return (
    <div className="App">
      <PlayerSide playerHands={playerHands} chips={chips} />
      <DealerSide dealerHand={dealerHand} />
      <ControlDashboard
        deck={deck}
        setDeck={setDeck}
        playerHands={playerHands}
        setPlayerHands={setPlayerHands}
        currentHand={currentHand}
        setCurrentHand={setCurrentHand}
        turn={turn}
        setTurn={setTurn}
      />
    </div>
  );
};

export default App;
