// AI-generated friendship quotes for photo captions
const friendshipQuotes = [
  "Friendship is the golden thread that ties our hearts together.",
  "In the garden of life, friends are the most beautiful flowers.",
  "A true friend is a treasure that time cannot fade.",
  "Friendship is born at that moment when one person says to another, 'What! You too?'",
  "The best mirror is an old friend who reflects the best in you.",
  "Friends are the family we choose for ourselves.",
  "A friend is someone who knows all about you and still loves you.",
  "Friendship is the only cement that will ever hold the world together.",
  "In the sweetness of friendship let there be laughter, and sharing of pleasures.",
  "A real friend is one who walks in when the rest of the world walks out.",
  "Friendship is not about who you've known the longest, it's about who came and never left your side.",
  "The language of friendship is not words but meanings.",
  "Friends are like stars, you don't always see them but you know they're always there.",
  "A single rose can be my garden, a single friend my world.",
  "Friendship is the comfort of knowing that even when you feel alone, you aren't.",
  "The most beautiful discovery true friends make is that they can grow separately without growing apart.",
  "Friendship is the shadow of the evening, which strengthens with the setting sun of life.",
  "A friend is one who overlooks your broken fence and admires the flowers in your garden.",
  "Friendship is the only relationship that survives all other relationships.",
  "True friendship comes when the silence between two people is comfortable.",
  "Friends are those rare people who ask how you are and then wait to hear the answer.",
  "A friend is someone who gives you total freedom to be yourself.",
  "Friendship is the inexpressible comfort of feeling safe with a person.",
  "The best kind of friendships are fierce side-by-side friendships, where you know the other person has your back.",
  "Friendship is the greatest gift one can give and receive.",
];

// Generate a friendship quote based on photo index
export const generateFriendshipQuote = (photoIndex: number): string => {
  // Use photo index to select a quote (ensures consistency for same photo)
  const quoteIndex = photoIndex % friendshipQuotes.length;
  return friendshipQuotes[quoteIndex];
};





