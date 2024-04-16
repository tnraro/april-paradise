export const POST = async ({ cookies, request, locals }) => {
  console.error({
    type: "client-error",
    user: locals.currentUser,
    body: await request.json(),
    createdAt: new Date(),
  });
  return new Response();
};
