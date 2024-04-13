export const getCocktailTriggerN = (type: string | undefined | null) => {
  switch (type) {
    case "탐색":
      return 10;
    case "조사":
      return 5;
  }
  return 0;
};
