import React, { useState, useEffect } from "react";
import "./BetInput.scss";

const BetInput = ({ setBet, chips, setChips }) => {
  const [input, setInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    if (errorMessage) {
      const revert = setTimeout(() => setErrorMessage(""), 1750);
      return () => clearTimeout(revert);
    }
  }, [errorMessage]);

  useEffect(() => {
    setErrorMessage("");
  }, [input]);

  const handleChange = e => {
    const value = e.target.value;
    const regEx = /[^0-9]/g;
    const containsNonNumber = regEx.test(value);
    if (containsNonNumber) {
      setErrorMessage("Only numbers allowed - duh!");
    } else {
      setInput(e.target.value);
    }
  };
  const handleClick = () => {
    const submittedBet = Number(input);
    if (submittedBet > chips) {
      setErrorMessage("You don't have enough chips to bet that much - duh!");
    } else {
      setBet(submittedBet);
      setChips(chips - submittedBet);
    }
  };
  const handleEnter = e => {
    if (e.key === "Enter") handleClick();
  };
  return (
    <div className="bet-input-wrapper">
      <input
        className="bet-input"
        value={input}
        onChange={handleChange}
        onKeyPress={handleEnter}
      />
      <button className="bet-input-button" onClick={handleClick}>
        Bet
      </button>
      {errorMessage && <p className="error">{errorMessage}</p>}
      {input.length === 0 && (
        <p className="enter-a-bet-message">Enter a bet first!</p>
      )}
    </div>
  );
};

export default BetInput;
