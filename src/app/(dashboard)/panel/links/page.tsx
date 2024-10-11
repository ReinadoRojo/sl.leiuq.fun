import { auth } from "@/auth";
import { notFound } from "next/navigation";
import { SelectApiKey } from "./_components/select-key";
import { getUserByEmail } from "@/lib/users";
import { getApiKeysByOwnerId } from "@/lib/apikeys";
import { TableLinks } from "./_components/links-table";

const LinksPage = async () => {
  const session = await auth();
  if (!session?.user) return notFound();

  const user = await getUserByEmail(session.user?.email as string);
  if (!user) return notFound();

  const userId = user.id;
  const apiKeyList = await getApiKeysByOwnerId(userId);

  return (
    <main className="h-screen pt-28 px-8">
      <SelectApiKey apiKeyList={apiKeyList} />
      <TableLinks session={session} />
    </main>
  );
};

export default LinksPage;
