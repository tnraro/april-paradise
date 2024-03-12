import type { Action } from "svelte/action";

const getPortals = (containerId: string = "portals") => {
  let portals = document.querySelector(`#${containerId}`);
  if (portals != null) return portals;
  portals = document.createElement("div");
  portals.id = containerId;
  portals.setAttribute("style", "isolation:isolate;");
  document.body.append(portals);
  return portals;
};

export const portal: Action<HTMLElement, { containerId?: string } | undefined> = (node, params) => {
  let portals = getPortals(params?.containerId);

  portals.append(node);
  return {
    update(params) {
      const nextPortals = getPortals(params?.containerId);
      nextPortals.append(node);
      if (portals?.childElementCount === 0) {
        portals.remove();
      }
      portals = nextPortals;
    },
    destroy() {
      node.remove();
      if (portals?.childElementCount === 0) {
        portals.remove();
      }
    },
  };
};
