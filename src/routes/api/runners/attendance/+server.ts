import { route } from "$lib/api/server";
import { client } from "$lib/data/client";
import { addChips } from "$lib/data/query/add-chips";
import { addTokens } from "$lib/data/query/add-tokens";
import { addResource } from "$lib/data/resources/add-resource";
import { getResource } from "$lib/data/resources/get-resource";
import { getRewardData } from "$lib/data/sheets/sheets";
import { error } from "@sveltejs/kit";
import type { RequestEvent } from "./$types";

const getKey = () => {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const date = String(today.getDate()).padStart(2, "0");
  const key = `attendance-${year}-${month}-${date}`;
  return key;
};

export type GET = typeof GET;
export const GET = route("get", async ({ locals }: RequestEvent) => {
  if (locals.user == null || locals.user.isBanned) error(401);
  const key = getKey();
  const count = await getResource(client, locals.user.id, key);

  return {
    today: count > 0,
  };
});
export type POST = typeof POST;
export const POST = route("post", async ({ locals }: RequestEvent) => {
  const user = locals.user;
  if (user == null || user.isBanned) error(401);
  return await client.transaction(async (tx) => {
    const key = getKey();
    const count = await getResource(tx, user.id, key);
    if (count > 0) {
      error(400, "이미 출석 했습니다");
    }
    const rewardData = await getRewardData();
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    const { reward } = rewardData.find((x) => x.key === "reward-0")!;

    await addResource(tx, user.id, key, 1);
    if (reward.type === "tokens") {
      await addTokens(tx, user.id, reward.quantity);
    } else if (reward.type === "chips") {
      await addChips(tx, user.id, reward.quantity);
    }
    return {};
  });
});
