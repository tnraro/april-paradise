<script lang="ts">
  import type { Cocktail } from "$lib/data/sheets/model";
  import { Tooltip } from "bits-ui";

  let { data } = $props();
</script>

{#snippet tooltip(cocktail: Cocktail, prefix: string)}
  <Tooltip.Root openDelay={0} disableHoverableContent={true}>
    <Tooltip.Trigger>
      {prefix}{cocktail.name}
    </Tooltip.Trigger>
    <Tooltip.Content
      side="bottom"
      align="center"
    >
      <h2>{cocktail.name}</h2>
      <div class="ingredients">
        {#each cocktail.ingredients.required as ingredient}
          <span class="ingredient">{ingredient}</span>
        {/each}
        {#each cocktail.ingredients.oneOf as ingredient}
          <span class="ingredient">{ingredient.join(" or ")}</span>
        {/each}
      </div>
    </Tooltip.Content>
  </Tooltip.Root>
{/snippet}

<h1>{data.name}</h1>
<div class="_">
  <div class="__title">키</div>
  <div class="__title">이름</div>
  <div class="__title">사랑하는</div>
  <div class="__title">좋아하는</div>
  {#each data.data as row (row.key)}
    <div class="__key" title={row.key}>{row.key}</div>
    <div>{row.npc}</div>
    {@render tooltip(row.love, "💛")}
    {@render tooltip(row.like, "⭐")}
  {/each}
</div>

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
