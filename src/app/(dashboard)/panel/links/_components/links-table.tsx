import Link from "next/link";
import type { Session } from "next-auth";

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
import { Pencil2Icon } from "@radix-ui/react-icons";
import { getLinksByOwnerId } from "@/lib/links";
import { getUserByEmail } from "@/lib/users";

import { CopyCatButton } from "./copycat-button";
import { OpenUpButton } from "./actionbuttons/openup-button";
import { ConfirmDeleteModal } from "./actionbuttons/delete-button";

export async function TableLinks({ session }: { session: Session }) {
  const user = await getUserByEmail(session.user?.email as string);
  if (!user) return null;

  const userId = user.id;
  const links = await getLinksByOwnerId(userId);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-auto max-w-[400px]">URL</TableHead>
          <TableHead>Short URL</TableHead>
          <TableHead className="w-36">Visits</TableHead>
          <TableHead className="w-auto text-right">Actions</TableHead>
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
                <Link href={lnk.longUrl}>{lnk.longUrl}</Link>
              </Button>
            </TableCell>
            <TableCell>
              <CopyCatButton svalue={lnk.shortUrl} />
            </TableCell>
            <TableCell>{lnk.visits}</TableCell>
            <TableCell className="flex justify-end gap-2 text-right">
              <OpenUpButton svalue={lnk.shortUrl} />
              <ConfirmDeleteModal linkId={lnk.id} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
