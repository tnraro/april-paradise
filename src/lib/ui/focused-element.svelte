<script lang="ts">
  import { usePresence } from "$lib/liveblocks/room.svelte";

  const onfocusin = (e: Event) => {
    if (!(e.target instanceof HTMLElement)) return;
    if (e.target.dataset.id == null) return;

    presence.update({
      focusedElement: e.target.dataset.id,
    });
    updateOutline("me", "green", e.target.dataset.id);
  };

  const onfocusout = (e: Event) => {
    presence.update({
      focusedElement: "",
    });
    updateOutline("me", "green", "");
  };

  const colors = ["red", "blue", "yellow", "purple"];

  const presence = usePresence({
    enter: () => {
      return {
        color: colors[(Math.random() * 4) | 0],
      };
    },
    leave: (user) => {
      clearOutline(user.id!);
    },
  });

  $inspect(presence.me);
  $inspect(presence.others);
  const clearOutline = (id: string) => {
    const before = document.querySelector<HTMLElement>(`[data-owner=${id}]`);
    if (before) {
      before.dataset.owner = undefined;
      before.classList.remove("focused", ...colors.map((color) => `focused-${color}`));
    }
  };

  const updateOutline = (id: string, color: string, focusedElement: string) => {
    clearOutline(id);
    if (!focusedElement) return;
    const target = document.querySelector<HTMLElement>(`[data-id=${focusedElement}]`);
    if (target == null) return;
    if (id !== "me" && target.dataset.owner === "me") return;
    target.dataset.owner = id;
    target.classList.add("focused", `focused-${color}`);
  };

  $effect(() => {
    presence.others.forEach((other) => {
      const localMeta = presence.getLocalMeta(other.id);
      if (other.id && localMeta) {
        updateOutline(other.id, localMeta.color, other.presence.focusedElement);
      }
    });
  });
</script>

<svelte:window {onfocusin} {onfocusout} />
