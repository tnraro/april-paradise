<script lang="ts">
  import { lures } from "$lib/shared/config/lures";
  import Lure from "../item/lure.svelte";

  const left = () => {
    const i = (index + lures.length - 1) % lures.length;
    value = lures[i];
  };
  const right = () => {
    const i = (index + 1) % lures.length;
    value = lures[i];
  };

  interface Props {
    value: string;
    currentLures: Record<string, number>;
  }
  let { value = $bindable(), currentLures }: Props = $props();

  let index = $derived(lures.findIndex((lure) => lure === value));
</script>

<div class="_">
  <div class="__">
    <button onclick={left}>&lt;</button>
    <div class="lures">
      <div class="lures__list" style:---x="-{index * 64}px">
        {#each lures as lure}
          <div class="lure">
            <Lure />
            <div class="lure__quantity">×{currentLures[lure]}</div>
          </div>
        {/each}
      </div>
    </div>
    <button onclick={right}>&gt;</button>
  </div>
  <div class="description">
    <p>{value}</p>
  </div>
</div>

<style lang="scss">
  ._ {
    display: grid;
    place-self: center;
    max-width: fit-content;
  }
  .__ {
    display: flex;
  }
  .lures {
    position: relative;
    width: 64px;
    aspect-ratio: 1/1;
    overflow: hidden;
    &__list {
      display: flex;
      position: absolute;
      transform: translateX(var(---x));
      transition: transform 0.2s ease-in-out;
    }
  }
  .lure {
    width: 100%;
    position: relative;
    &__quantity {
      right: 0;
      bottom: 0;
      position: absolute;
      filter: drop-shadow(0 0 1px white);
    }
  }
  button {
    align-items: center;
  }
  .description {
    position: relative;
    width: 100%;
    height: 1.5rem;
    & p {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      text-align: center;
      text-wrap: nowrap;
    }
  }
</style>
