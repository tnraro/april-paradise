<script lang="ts">
  import type { Money } from "$lib/data/sheets/model";
  import { portal } from "$lib/ui/actions/portal";
  import { fly } from "svelte/transition";
  import AchievementComponent from "../achievement/achievement-component.svelte";
  import Item from "../item/item.svelte";

  interface Props {
    name: string;
    condition: string;
    reward: Money;
    isHidden: boolean;
    onclose?: () => void;
  }
  let { name, condition, reward, isHidden, onclose }: Props = $props();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="achievement"
  use:portal={{ containerId: "achievements" }}
  in:fly={{ y: -100 }}
  onclick={onclose}
>
  <AchievementComponent {name} {condition} {isHidden} {reward} isDone={true} />
</div>

<style lang="scss">
  @use "$lib/ui/styles/mixin";
  .achievement {
    @include mixin.select-none;
    position: fixed;
    top: 0;
    left: 50%;
    width: min(20rem, 90%);
    border-radius: 0.5rem;
    transform: translate(-50%, 0);
    box-shadow: var(--height-4);
    transition: top 200ms ease-out;
    & > :global(*:first-child) {
      flex: 1 1 min-content;
    }
    @for $i from 1 to 11 {
      &:nth-child(#{$i}) {
        top: ($i - 1) * 5rem + 1rem;
      }
    }
  }
</style>
