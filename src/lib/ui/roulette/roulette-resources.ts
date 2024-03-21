import chipImg from "$img/chip.png?enhanced&w=64";
import tokenImg from "$img/token.png?enhanced&w=64";

export const tokenSrc = (tokenImg as unknown as { img: { src: string } }).img
  .src;
export const chipSrc = (chipImg as unknown as { img: { src: string } }).img.src;
