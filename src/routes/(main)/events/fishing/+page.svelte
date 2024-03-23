<script lang="ts">
  import { api } from "$lib/api/api.gen";
  const oncast = async (lure: string) => {
    const res = await api().events.fishing.post({
      lure: lure as "까만 콩 지렁이" | "토깽이 떡밥" | "사우루숭 벌레 유충",
    });
    if (!res.ok) throw res;
    return res.data.result;
  };
  import Fishing from "$lib/ui/fishing/fishing.svelte";
</script>

<Fishing {oncast} />
