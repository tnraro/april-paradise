export const POST = async ({ cookies, request }) => {
  console.error({
    type: "client-error",
    cookies: {
      "edgedb-session": cookies.get("edgedb-session"),
    },
    body: await request.json(),
    createdAt: new Date(),
  });
  return new Response();
};
