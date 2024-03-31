const items = import.meta.glob<boolean, string, { default: string }>(
  "$img/items/*.png",
  {
    query: {
      enhanced: true,
      w: 64,
    },
  },
);

export const getItems = (key: string) =>
  items[`/src/lib/ui/resources/items/${key}.png`]?.();
