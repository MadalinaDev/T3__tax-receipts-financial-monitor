import { auth, currentUser } from "@clerk/nextjs/server";

export async function getClerkUser() {
  const authSession = await auth();
  const user = await currentUser();

  if (!authSession.sessionId || !user) {
    return null;
  }

  return {
    session: authSession,
    user,
  };
}
