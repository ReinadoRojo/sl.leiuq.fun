import { auth } from "@/auth";
import { notFound } from "next/navigation";
import { TableLinks } from "./_components/links-table";
import { CreateLinkModal } from "./_components/create-link";

const LinksPage = async () => {
  const session = await auth();
  if (!session?.user) return notFound();

  return (
    <main className="h-screen pt-28 px-8 space-y-4">
      <CreateLinkModal />
      <TableLinks session={session} />
    </main>
  );
};

export default LinksPage;
