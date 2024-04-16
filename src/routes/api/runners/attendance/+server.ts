import { route } from "$lib/api/server";
import { addChips } from "$lib/data/query/add-chips.query";
import { addTokens } from "$lib/data/query/add-tokens.query";
import { addResource } from "$lib/data/resources/add-resource.query";
import { getResource } from "$lib/data/resources/get-resource.query";
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
  if (locals.currentUser == null || locals.currentUser.isBanned) error(401);
  const key = getKey();
  const count = await getResource(locals.client, {
    key,
  });

  return {
    today: count > 0,
  };
});
export type POST = typeof POST;
export const POST = route("post", async ({ locals }: RequestEvent) => {
  if (locals.currentUser == null || locals.currentUser.isBanned) error(401);
  return await locals.client.transaction(async (tx) => {
    const key = getKey();
    const count = await getResource(tx, {
      key,
    });
    if (count > 0) {
      error(400, "이미 출석 했습니다");
    }
    const rewardData = await getRewardData();
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    const { reward } = rewardData.find((x) => x.key === "reward-0")!;

    await addResource(tx, {
      key,
      value: 1,
    });
    if (reward.type === "tokens") {
      await addTokens(tx, {
        tokens: reward.quantity,
      });
    } else if (reward.type === "chips") {
      await addChips(tx, {
        chips: reward.quantity,
      });
    }
    return {};
  });
});
