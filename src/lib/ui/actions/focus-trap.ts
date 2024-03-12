import { tick } from "svelte";
import type { Action } from "svelte/action";

export const focusTrap: Action = (node) => {
  const focusables = [
    ...node.querySelectorAll<HTMLElement>(`a[href]:not(:disabled),
    button:not(:disabled),
    textarea:not(:disabled),
    select:not(:disabled),
    input:not([hidden]):not(:disabled),
    [tabindex]:not([tabindex="-1"]):not(:disabled)`),
  ];
  const first = focusables.at(0);
  const last = focusables.at(-1);
  tick().then(() => {
    first?.focus();
  });
  const onkeydown = (e: KeyboardEvent) => {
    if (e.key !== "Tab") return;
    const isForward = !e.shiftKey;
    if (isForward && document.activeElement === last) {
      e.preventDefault();
      first?.focus();
    }
    if (!isForward && document.activeElement === first) {
      e.preventDefault();
      last?.focus();
    }
  };
  window.addEventListener("keydown", onkeydown);
  return {
    destroy: () => {
      window.removeEventListener("keydown", onkeydown);
    },
  };
};
