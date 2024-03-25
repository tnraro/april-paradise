export const isEndsWith받침 = (text: string) => {
  const lastCharacter = text.at(-1);
  if (lastCharacter == null) return false;
  if (!/[가-힣]$/.test(lastCharacter)) return false;
  const 받침 = ((text.at(-1)?.codePointAt(0) ?? 0) - 0xac00) % 28;
  return 받침 !== 0;
};

export const josa = (
  text: string,
  endsWith받침: string,
  endsWithout받침: string,
) => {
  return isEndsWith받침(text) ? endsWith받침 : endsWithout받침;
};

export const josa2 = (
  text: string,
  endsWith받침: string,
  endsWithout받침: string,
) => {
  return `${text}${josa(text, endsWith받침, endsWithout받침)}`;
};
