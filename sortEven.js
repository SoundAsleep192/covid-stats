const input = [3, 10, 12, 1, 2, 14, 4, 8, 2, 25, 17, 6, 19];

console.log('input: ' + input);

function sortEven(initialArray) {
  // take only the even values and cache them in pairs of [value, initialIndex] to remember their position
  const valueIndexPairs = initialArray
    .map((number, index, array) => {
      if (number % 2 === 0) return [number, index];
      return null;
    })
    .filter(n => n !== null);

  // take only the values out of the pairs and sort them by ascending
  const valuesSorted = valueIndexPairs
    .map(pair => pair[0])
    .sort((a, b) => a - b);

  // once they are sorted, put them back into our cache
  const sortedEvenValuesKeys = valueIndexPairs.map(([_, initialKey], currentIndex) => [valuesSorted[currentIndex], initialKey]);

  // and put them into the initial array by the indexes they were taken out!
  sortedEvenValuesKeys.forEach(([n, i]) => initialArray[i] = n);

  return initialArray;
}

console.log('sort1: ' + sortEven(input));
