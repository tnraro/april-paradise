const imgs = import.meta.glob<boolean, string, { default: string }>(
  "$img/*.png",
  {
    query: {
      enhanced: true,
      w: 64,
    },
  },
);

export const getImg = (key: string) =>
  imgs[`/src/lib/ui/resources/${key}.png`]?.();
