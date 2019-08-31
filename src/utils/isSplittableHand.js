const getRankFromCard = card => card.split(" ")[0];

export const isSplittableHand = hand =>
  hand.length === 2 && getRankFromCard(hand[0]) === getRankFromCard(hand[1]);
