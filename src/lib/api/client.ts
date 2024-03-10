export const req = async <Entry extends { body: unknown; response: unknown }>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  path: string,
  body: Entry["body"],
): Promise<{ ok: true; data: Entry["response"] } | { ok: false; error: { message: string } }> => {
  const res = await fetch(path, {
    method,
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    return { ok: false, error: await res.json() };
  }
  return { ok: true, data: await res.json() };
};
