import React, { useEffect, useState } from "react";
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
  const [currentPlayerHand, setCurrentPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [bet, setBet] = useState(0);
  const [isDouble, toggleDouble] = useState(false);
  const [isInsured, toggleIsInsured] = useState(false);
  const [turn, setTurn] = useState("player");

  const testMode = true;

  useEffect(() => {
    if (testMode) {
      const mockPlayerHands = [["seven of clubs", "seven of hearts"]];
      const mockCurrentPlayerHand = ["seven of clubs", "seven of hearts"];
      const mockDeck = generateShuffledDeck().filter(
        card => card !== "seven of clubs" && card !== "seven of hearts"
      );
      setDeck(mockDeck);
      setPlayerHands(mockPlayerHands);
      setCurrentPlayerHand(mockCurrentPlayerHand);
    } else {
      const shuffledDeck = generateShuffledDeck();
      setDeck(shuffledDeck);
    }
  }, []);

  useEffect(() => {
    if (deck.length === 52 && !testMode) dealHands();
  }, [deck]);

  useEffect(() => {
    if (sumHand(currentPlayerHand) >= 21) {
      const handsCopy = cloneDeep(playerHands);
      const currentIndex = playerHands.findIndex(hand =>
        isEqual(hand, currentPlayerHand)
      );
      const nextHand = handsCopy[currentIndex + 1];
      if (nextHand) {
        setCurrentPlayerHand(nextHand);
      } else {
        setTurn("dealer");
      }
    }
  }, [currentPlayerHand]);

  const dealHands = () => {
    const deckCopy = [...deck];
    const playerHand = [deckCopy.pop(), deckCopy.pop()];
    const dealerHand = [deckCopy.pop(), deckCopy.pop()];
    setPlayerHands([playerHand]);
    setDealerHand(dealerHand);
    setDeck(deckCopy);
    setCurrentPlayerHand(playerHand);
  };

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
        currentPlayerHand={currentPlayerHand}
        setCurrentPlayerHand={setCurrentPlayerHand}
      />
    </div>
  );
};

export default App;
