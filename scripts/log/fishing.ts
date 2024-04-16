import { $ } from "bun";

interface Lure {
  name: string;
  lures: number;
}
interface Fish {
  name: string;
  times: number;
}

const lures: Lure[] =
  await $`edgedb -I ap_prod query -F json 'with lures := ( select Log filter .table = "Item::lure" and .action = "update" ), groups := ( group lures by (.agent) ) select groups { name := .key.agent, lures := sum(( select .elements { createdAt, change, value := <int64>str_split(.change, "->")[0] - <int64>str_split(.change, "->")[1] } filter .value > 0 ).value) }'`.json();

const fishes: Fish[] =
  await $`edgedb -I ap_prod query 'with a := ( select Item filter .category = "fish" or .category = "garbage" ), b := ( group a by (.owner) ) select b  { name := .key.owner.key, times := sum(.elements.quantity) }' -F json`.json();

interface User {
  name: string;
  lures?: number;
  times?: number;
}
const m = new Map<string, User>();
{
  const f = (t: (Lure | Fish)[]) => {
    for (const x of t) {
      const v = m.get(x.name) ?? {};

      m.set(x.name, {
        ...v,
        ...x,
      });
    }
  };
  f(lures);
  f(fishes);
}

console.log(
  [...m.values()]
    .map((x) => `${x.name},${x.lures ?? 0},${x.times ?? 0}`)
    .join("\n"),
);
