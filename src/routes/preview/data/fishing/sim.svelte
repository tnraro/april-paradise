<script lang="ts">
  import type { FishingData } from "$lib/data/sheets/model";
  import { pick } from "$lib/shared/random/pick";
  import { groupBy } from "$lib/shared/util/group-by";
  import Fishing from "$lib/ui/fishing/fishing.svelte";

  const oncast = async (lure: string) => {
    const data = groupByLure.get(lure);
    if (data == null) throw "unknown lure";
    const caughtFish = pick(data);
    return caughtFish;
  };

  interface Props {
    table: FishingData[];
  }
  let { table } = $props<Props>();
  let groupByLure = $derived(groupBy(table, (fish) => fish.lure));
</script>

<div class="__sim">
  <h2>모의 체험</h2>
  <Fishing {oncast} />
</div>

<style lang="scss">
  .__sim {
    min-height: 20rem;
    filter: url(#fishing-motion-blur);
    user-select: none;
    -webkit-user-select: none;
  }
</style>
