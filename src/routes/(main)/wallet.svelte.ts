interface Wallet {
  chips: number;
  tokens: number;
}

let wallet = $state<Wallet>({
  chips: 0,
  tokens: 0,
});

export const useWallet = (initial?: Wallet | null) => {
  if (initial != null) {
    wallet = initial;
  }
  return {
    get chips() {
      return wallet.chips;
    },
    get tokens() {
      return wallet.tokens;
    },
    set chips(value: number) {
      wallet.chips = value;
    },
    set tokens(value: number) {
      wallet.tokens = value;
    },
    update(state?: Wallet | null) {
      if (state == null) return;
      wallet = state;
    },
  };
};
