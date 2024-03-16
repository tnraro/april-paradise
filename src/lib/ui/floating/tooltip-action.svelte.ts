import type { Action } from "svelte/action";

export const createTooltip = <T>() => {
  const valueMap = new WeakMap<HTMLElement, T | undefined>();
  let value = $state.frozen<T>();
  let pos = $state.frozen({ x: 0, y: 0 });
  // @ts-expect-error ok
  const target: Action<HTMLElement, T> = (node, _value) => {
    valueMap.set(node, _value);
    const handler = (e: MouseEvent) => {
      if (e.type === "mouseover") {
        value = valueMap.get(node);
        const rect = node.getBoundingClientRect();
        pos = {
          x: rect.x + rect.width / 2,
          y: rect.bottom,
        };
      } else {
        value = undefined;
      }
    };
    node.addEventListener("mouseover", handler);
    node.addEventListener("mouseout", handler);
    return {
      update(_value) {
        valueMap.set(node, _value);
      },
      destroy() {
        node.removeEventListener("mouseover", handler);
        node.removeEventListener("mouseout", handler);
      },
    };
  };

  return {
    target,
    get value() {
      return value;
    },
    get pos() {
      return pos;
    },
  };
};
