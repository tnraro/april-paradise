import type { StylebookMeta } from "$lib/ui/stylebook";
import Component from "./mail.svelte";

export const meta: StylebookMeta<typeof Component, Component> = {
  Component,
  variants: {
    default: {
      sender: "총괄",
      title: "연장 점검 안내 및 보상",
      body: "미안합니다\n쏘리",
      reward: "token:2",
      createdAt: new Date(),
      isReceived: false,
    },
    a: {
      sender: "총괄",
      title: "긴급 점검 보상 안내",
      body: "안녕하세요 총괄입니다.\n\n죄송한 마음에 소정의 토큰 두 개와 칩 열 개를 드립니다.",
      reward: "token:2,chip:10",
      createdAt: new Date("2024-04-08"),
      isReceived: true,
    },
    b: {
      sender: "총괄",
      title: "임시 점검 안내",
      body: "가나다라마바사",
      reward: "token:5",
      createdAt: new Date("2024-04-01"),
      isReceived: true,
    },
    c: {
      sender: "제니",
      title: "자, 네게만 보내는 편지란다",
      body: "잘먹고건강하렴",
      reward: "인형:5000",
      createdAt: new Date("2023-12-04"),
      isReceived: true,
    },
  },
};
