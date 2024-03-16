<script lang="ts">
  import type { Cocktail } from "$lib/data/sheets/model";
  import { createTooltip } from "$lib/ui/floating/tooltip-action.svelte";
  import Tooltip from "$lib/ui/floating/tooltip.svelte";

  let { data } = $props();

  const tooltip = createTooltip<Cocktail>();
</script>

<h1>{data.name}</h1>
<div class="_">
  <div class="title">키</div>
  <div class="title">이름</div>
  <div class="title">사랑하는</div>
  <div class="title">좋아하는</div>
  {#each data.data as row (row.key)}
    <div class="key" title={row.key}>{row.key}</div>
    <div>{row.npc}</div>
    <button use:tooltip.target={row.love}>
      💛{row.love.name}
    </button>
    <button use:tooltip.target={row.like}>
      ⭐{row.like.name}
    </button>
  {/each}
</div>

{#if tooltip.value}
  <Tooltip pos={tooltip.pos}>
    <h2>{tooltip.value.name}</h2>
    <div class="ingredients">
      {#each tooltip.value.ingredients.required as ingredient}
        <span class="ingredient">{ingredient}</span>
      {/each}
      {#each tooltip.value.ingredients.oneOf as ingredient}
        <span class="ingredient">{ingredient.join(" or ")}</span>
      {/each}
    </div>
  </Tooltip>
{/if}

<style>
  ._ {
    display: grid;
    grid-template-columns: repeat(4, max-content);
    gap: 0.25rem 0.5rem;
    align-items: center;
  }
  .ingredients {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem 0.5rem;
  }
  .ingredient {
    background: var(--slate-3);
    border-radius: 0.25rem;
    padding: 0 0.25rem;
  }
</style>
