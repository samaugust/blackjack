import React, { useState, useEffect } from "react";
import "./BetInput.scss";

const BetInput = ({ setBet, chips, setChips }) => {
  const [input, setInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    if (errorMessage) {
      const revert = setTimeout(() => setErrorMessage(""), 1400);
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
      setInput(e.target.value.slice(0, -1));
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
  return (
    <div className="bet-input">
      <input value={input} onChange={handleChange} />
      <button onClick={handleClick}>Bet</button>
      {errorMessage && <span style={{ color: "red" }}>{errorMessage}</span>}
    </div>
  );
};

export default BetInput;
