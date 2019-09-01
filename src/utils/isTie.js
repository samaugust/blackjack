import { sumHand } from "./sumHand";

export const isTie = (playerHand, dealerHand) => {
  const playerScore = sumHand(playerHand);
  const dealerScore = sumHand(dealerHand);
  return (
    (playerScore <= 21 && playerScore === dealerScore) ||
    (playerScore > 21 && dealerScore > 21)
  );
};
