// Fisher–Yates (aka Knuth) Shuffle.
export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  const shuffledArray: T[] = [];
  // Use a for loop to shuffle the array
  for (let i = array.length - 1; i > 0; i--) {
    // Pick a random index from 0 to i
    const randomIndex = Math.floor(Math.random() * (i + 1));
    shuffledArray.push(newArray[randomIndex]); // add the randomly selected element to the shuffled array
    newArray.splice(randomIndex, 1); // remove the element from the original array
  }
  return shuffledArray;
}
