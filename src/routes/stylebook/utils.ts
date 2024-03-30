export interface Control {
  type: "string" | "number" | "boolean" | "array";
  path: string[];
  default: unknown;
}

export const propsToControls = (props: unknown) => {
  const controls: Control[] = [];
  const traverse = (value: unknown, path: string[]) => {
    switch (typeof value) {
      case "string":
      case "number":
      case "boolean":
        controls.push({
          type: typeof value as "string" | "number" | "boolean",
          path,
          default: value,
        });
        break;
      case "object": {
        if (value == null) break;
        if (Array.isArray(value)) {
          controls.push({
            type: "array",
            path,
            default: value,
          });
          break;
        }
        for (const [key, v] of Object.entries(value)) {
          traverse(v, [...path, key]);
        }
        break;
      }
      default:
        console.warn("unsupported type:", typeof value, value);
    }
  };
  traverse(props, []);
  return controls;
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const value = (props: any, path: string[]) => {
  let ref = props;
  for (const key of path) {
    ref = ref[key];
  }
  return ref;
};

export const oninput =
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    (props: any, path: string[]) =>
    (e: {
      currentTarget: { type: string; value: string; checked: boolean };
    }) => {
      let ref = props;
      const paths = path.slice(0, -1);
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      const key = path.at(-1)!;
      for (const key of paths) {
        ref = ref[key];
      }
      switch (e.currentTarget.type) {
        case "number":
          ref[key] = Number(e.currentTarget.value);
          break;
        case "boolean":
          ref[key] = e.currentTarget.checked;
          break;
        default:
          ref[key] = e.currentTarget.value;
      }
    };
