import type { StylebookMeta } from "$lib/ui/stylebook";
import Component from "./cocktail.svelte";

export const meta: StylebookMeta<typeof Component, Component> = {
  Component,
  variants: {
    default: {
      key: "entry",
      title: null,
      npc: null,
      script: "고생해준 선원들을 위해 칵테일을 만들어 선물하자!",
      next: ["0"],
      triggerType: null,
      back: null,
    },
    npc: {
      key: "조사-갑판-스태프에 대해 물어보기",
      title: "갑판",
      npc: "승무원B",
      script:
        "술은 잘... 드시지 않으셨던... 것... 같지만... 상큼한 걸 좋아한다고... 하셨거든요... 모히또가 아닐까요...",
      next: null,
      triggerType: null,
      back: "갑판3",
    },
    탐색: {
      key: "승무원실",
      title: "승무원실",
      npc: null,
      script:
        "승무원분은 안 계시는 듯하다. 문을 열자마자 보이는 [침대]들과 [책상]과 [의자], [책장], [물품 박스], [작은 게시판]이 있다.",
      next: [
        "침대1",
        "침대2",
        "침대3",
        "침대4",
        "책상",
        "의자",
        "책장",
        "물품 박스",
        "작은 게시판",
      ],
      triggerType: "탐색",
      back: "탐색하기",
    },
    조사: {
      key: "라운지3",
      title: "라운지",
      npc: null,
      script: "누구에 대해 물어보지...?",
      next: [
        "항해사에 대해 물어보기",
        "승무원A에 대해 물어보기",
        "승무원B에 대해 물어보기",
        "셰프에 대해 물어보기",
        "스태프에 대해 물어보기",
      ],
      triggerType: "조사",
      back: "조사하기",
    },
  },
};
