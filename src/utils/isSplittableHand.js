const getRankFromCard = card => card.split(" ")[0];

export const isSplittableHand = ({ cards }) =>
  cards.length === 2 && getRankFromCard(cards[0]) === getRankFromCard(cards[1]);
