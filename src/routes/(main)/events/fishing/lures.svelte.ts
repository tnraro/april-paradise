export interface Lures {
  "까만 콩 지렁이": number;
  "토깽이 떡밥": number;
  "사우루숭 벌레 유충": number;
}

let lures = $state<Lures>({
  "까만 콩 지렁이": 0,
  "토깽이 떡밥": 0,
  "사우루숭 벌레 유충": 0,
});

export const useLures = (initial?: Lures | null) => {
  if (initial != null) {
    lures = initial;
  }
  return {
    get "까만 콩 지렁이"() {
      return lures["까만 콩 지렁이"];
    },
    set "까만 콩 지렁이"(value: number) {
      lures["까만 콩 지렁이"] = value;
    },
    get "토깽이 떡밥"() {
      return lures["토깽이 떡밥"];
    },
    set "토깽이 떡밥"(value: number) {
      lures["토깽이 떡밥"] = value;
    },
    get "사우루숭 벌레 유충"() {
      return lures["사우루숭 벌레 유충"];
    },
    set "사우루숭 벌레 유충"(value: number) {
      lures["사우루숭 벌레 유충"] = value;
    },
  };
};
