function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

export const generateJumbledArr = (max: number) => {
  const ARR = Array.from(Array(max).keys());
  let arr = ARR;
  const newArr: number[] = [];
  while (arr.length !== 0) {
    const randomIndex = getRandomInt(arr.length);
    const pickedNumber = arr[randomIndex];
    newArr.push(pickedNumber);
    arr = arr.filter((number) => number !== pickedNumber);
  }
  return newArr;
};
