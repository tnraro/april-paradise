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
): Promise<{ ok: true; data: Entry["returns"] } | { ok: false; error: { message: string } }> => {
  const url = path.replaceAll(/(?<=\/)\[([^\]]+)\]/g, (_, $1) => params[$1]);
  const res = await _fetch(url, {
    method,
    body: body != null ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    return { ok: false, error: await res.json() };
  }
  return { ok: true, data: await res.json() };
};
