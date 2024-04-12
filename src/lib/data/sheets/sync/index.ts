import { client } from "$lib/data/client";
import { stringify } from "devalue";
import { setData } from "../sheets";
import { fetch } from "./fetch";
import { updateSheets } from "./update-sheets.query";

export const update = async () => {
  const ranges = await fetch();
  if (ranges) {
    await updateSheets(client, {
      data: ranges.map((x) => ({
        ...x,
        data: stringify(x.data),
      })),
    });
    setData(ranges);
  }
};
