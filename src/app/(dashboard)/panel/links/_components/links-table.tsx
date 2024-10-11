import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getLinksByOwnerId } from "@/lib/links";
import { getUserByEmail } from "@/lib/users";

import type { Session } from "next-auth";
import Link from "next/link";
import { CopyCatButton } from "./copycat-button";

export async function TableLinks({ session }: { session: Session }) {
  const user = await getUserByEmail(session.user?.email as string);
  if (!user) return null;

  const userId = user.id;
  const links = await getLinksByOwnerId(userId);

  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-auto max-w-[calc(100% * 2/3)]">URL</TableHead>
          <TableHead>Short URL</TableHead>
          <TableHead>Visits</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {links.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4} className="h-24 text-center">
              No links found
            </TableCell>
          </TableRow>
        ) : null}
        {links.map((lnk, idx) => (
          <TableRow key={idx}>
            <TableCell className="font-medium">
              <Button asChild variant={"link"}>
                <Link href={lnk.longUrl}>
                  {lnk.longUrl}
                </Link>
              </Button>
            </TableCell>
            <TableCell>
              <CopyCatButton svalue={lnk.shortUrl} />
            </TableCell>
            <TableCell>{lnk.visits}</TableCell>
            <TableCell className="text-right">
              <Button variant="secondary">More info</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
