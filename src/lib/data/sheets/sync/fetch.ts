import { env } from "$env/dynamic/private";
import { auth, sheets } from "@googleapis/sheets";
import { stringify } from "devalue";
import { config } from "./config";

const googleSheets = sheets({
  version: "v4",
  auth: new auth.JWT(
    env.SHEETS_CLIENT_EMAIL,
    undefined,
    env.SHEETS_PRIVATE_KEY,
    ["https://www.googleapis.com/auth/spreadsheets"],
  ),
});

export const fetch = async () => {
  const context = await googleSheets.spreadsheets.values.batchGet({
    spreadsheetId: env.SHEETS_ID,
    ranges: config.sheets.map((x) => `${x.sheet}!${x.range}`),
  });

  const ranges = context.data.valueRanges
    ?.map((x) => x.values)
    .filter(<T>(x: T | undefined | null): x is T => x != null)
    .map((x, i) => {
      const titles = x[0];
      const rows = x.slice(1);

      const c = config.sheets[i];

      return {
        sheet: c.sheet,
        data: stringify(
          rows.map((row) =>
            c.map(
              titles.reduce(
                (o, key, i) => {
                  const value = row[i]?.trim();
                  o[key] = value ? value : null;
                  return o;
                },
                {} as Parameters<typeof c.map>[0],
              ),
            ),
          ),
        ),
      };
    });
  return ranges;
};
