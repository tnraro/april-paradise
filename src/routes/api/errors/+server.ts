export const POST = async ({ request, locals }) => {
  console.error({
    type: "client-error",
    user: locals.user,
    body: await request.json(),
    createdAt: new Date(),
  });
  return new Response();
};
