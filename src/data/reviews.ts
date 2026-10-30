// Lodestar Advising — Google Reviews
// Add new reviews here. The homepage automatically:
//   • displays the top 4 by rating (ties keep the order below)
//   • updates the "· N reviews" count based on the total length
export type Review = {
  name: string;
  text: string;
  rating: number; // 1–5
};

export const reviews: Review[] = [
  {
    name: "Veronica Douglas",
    text: "Lodestar is the best value we found for college counseling, hands down. A lot of companies wanted to charge us close to five figures. Krish delivered a better experience for a fraction of the price.",
    rating: 5,
  },
  {
    name: "Hussein Jahlahlilah",
    text: "The peer-to-peer model actually works. My kid and I were very comfortable working with Krish and at the end he got into his top university (Northeastern).",
    rating: 5,
  },
  {
    name: "Mokshith Anand",
    text: "The peer to peer model worked well and Krish was very dedicated to supporting us through each step of the college application process. Recommend!",
    rating: 5,
  },
  {
    name: "Jon Nelson",
    text: "We've worked with Krish for a few weeks now for the personal essay and he has explained each and every edit he made in detail. Excellent guidance.",
    rating: 5,
  },
  {
    name: "Maxime Saw",
    text: "Very affordable and the peer to peer model worked well for my daughter.",
    rating: 5,
  },
  {
    name: "Francis G.",
    text: "We had a very positive experience with Lodestar. The peer-to-peer mentoring model worked extremely well and made the process feel personal.",
    rating: 5,
  },
  {
    name: "Jeffrey Rewsnut",
    text: "Completed the 1 hour college counseling session and loved it!",
    rating: 5,
  },
  {
    name: "Thomas Brunet",
    text: "Great experience working with Lodestar Advising.",
    rating: 5,
  },
];

// Top 4 for the homepage grid (ties preserve source order).
export const featuredReviews = [...reviews]
  .map((r, i) => ({ r, i }))
  .sort((a, b) => b.r.rating - a.r.rating || a.i - b.i)
  .slice(0, 4)
  .map(({ r }) => r);

export const totalReviewCount = reviews.length;
export const averageRating =
  reviews.reduce((sum, r) => sum + r.rating, 0) / (reviews.length || 1);
