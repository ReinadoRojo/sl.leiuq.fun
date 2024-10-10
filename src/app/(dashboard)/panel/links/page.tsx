import { auth } from "@/auth";
import { TableDemo } from "./_components/links-table";
import { notFound } from "next/navigation";

const LinksPage = async () => {
  const session = await auth();

  if(!session?.user) return notFound();

  return (
    <main className="h-screen pt-28">
      <TableDemo session={session}/>
    </main>
  );
};

export default LinksPage;
