export const load = async ({ locals }) => {
  const session = locals.auth.session;
  const isSignedIn = await session.isSignedIn();

  return {
    isSignedIn,
  };
};
