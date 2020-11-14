export default function isPuzzleSolvable(numbers) {
  let kDisorder = 0;
  for (let i = 1, len = numbers.length - 1; i < len; i++) {
    for (let j = i - 1; j >= 0; j--) {
      if (numbers[j] > numbers[i]) {
        kDisorder += 1;
      }
    }
  }
  return !(kDisorder % 2);
}
