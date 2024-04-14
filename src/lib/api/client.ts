export const req = async <
  Entry extends {
    returns: unknown;
    params: Record<string, string>;
    route: string;
    method: "GET" | "POST" | "PUT" | "DELETE";
    body: unknown;
  },
>(
  method: Entry["method"],
  path: Entry["route"],
  params: Entry["params"],
  body?: Entry["body"] | Readonly<Entry["body"]>,
  _fetch = fetch,
): Promise<
  | { ok: true; status: number; data: Entry["returns"] }
  | { ok: false; status: number; error: App.Error }
> => {
  const url = path.replaceAll(/\/\[([^\]]+)\]/g, (_, $1) => `/${params[$1]}`);
  const res = await _fetch(url, {
    method,
    body: body != null ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    return { ok: false, status: res.status, error: await res.json() };
  }
  return { ok: true, status: res.status, data: await res.json() };
};
