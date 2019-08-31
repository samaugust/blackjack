/* Googled it and found that the"Fisher-Yates Shuffle" algo
is the best for a truly non-biased shuffle. Neat-o factoid! (maybe)

I am using Mike Bostock’s code (creator of the D3 visual library) 
as a Javascript implementation of this algorithm
*/
const shuffle = deck => {
  let m = deck.length,
    i;
  while (m) {
    i = Math.floor(Math.random() * m--);
    [deck[m], deck[i]] = [deck[i], deck[m]];
  }
  return deck;
};

const SUITS = ["hearts", "diamonds", "spades", "clubs"];
const RANKS = [
  "ace",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "jack",
  "queen",
  "king"
];

const UNSHUFFLED_DECK = RANKS.flatMap(rank =>
  SUITS.map(suit => `${rank} of ${suit}`)
);

export const generateShuffledDeck = () => {
  return shuffle(UNSHUFFLED_DECK);
};
