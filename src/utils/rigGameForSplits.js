import { generateShuffledDeck } from "./generateShuffledDeck";

export const rigGameForSplits = bet => {
  //rigged deal to guarantee a splittable hand for player
  const riggedPlayerHands = [{ cards: ["two of clubs", "two of hearts"], bet }];
  const riggedCurrentHand = { cards: ["two of clubs", "two of hearts"], bet };
  //filter out the remaining 2s which will be added to top of deck
  //as well as the already-dealt cards (to avoid buggy behavior)
  const riggedDeck = generateShuffledDeck().filter(
    card =>
      ![
        "two of clubs",
        "two of hearts",
        "two of diamonds",
        "two of spades"
      ].includes(card)
  );
  const dealerHand = { cards: [riggedDeck.pop(), riggedDeck.pop()] };
  //stack the deck so that the top two cards will be the remaining 2s
  riggedDeck.push("two of diamonds", "two of spades");
  return { riggedDeck, dealerHand, riggedPlayerHands, riggedCurrentHand };
};
