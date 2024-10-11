import { auth } from "@/auth";
import { notFound } from "next/navigation";
import { TableLinks } from "./_components/links-table";

const LinksPage = async () => {
  const session = await auth();
  if (!session?.user) return notFound();

  return (
    <main className="h-screen pt-28 px-8">
      <TableLinks session={session} />
    </main>
  );
};

export default LinksPage;
