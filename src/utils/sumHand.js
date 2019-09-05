const rankToValuesMap = {
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  jack: 10,
  queen: 10,
  king: 10
};

const getRankFromCard = card => card.split(" ")[0];

const getHandTotals = cards => {
  return cards.reduce(
    (totals, currentCard) => {
      const rank = getRankFromCard(currentCard);
      if (rank === "ace") {
        return { ...totals, totalAces: totals.totalAces + 1 };
      } else {
        const value = rankToValuesMap[rank];
        return { ...totals, scoreWithoutAces: totals.scoreWithoutAces + value };
      }
    },
    { scoreWithoutAces: 0, totalAces: 0 }
  );
};

const calculateScoreWithAces = (scoreWithoutAces, totalAces) => {
  if (totalAces === 0) return scoreWithoutAces;
  const largerScore = scoreWithoutAces + totalAces + 10;
  const smallerScore = scoreWithoutAces + totalAces;
  return largerScore <= 21 ? largerScore : smallerScore;
};

export const sumHand = ({ cards }) => {
  const { scoreWithoutAces, totalAces } = getHandTotals(cards);
  return calculateScoreWithAces(scoreWithoutAces, totalAces);
};
