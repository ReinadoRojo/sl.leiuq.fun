"use client";
import { Button } from "@/components/ui/button";
import { OpenInNewWindowIcon } from "@radix-ui/react-icons";

export const OpenUpButton = ({ svalue }: { svalue: string }) => {
  const openlink = (e: any) => {
    const thisUrl = `${window.location.origin}`;
    window.open(`${thisUrl}/${svalue}`, "_blank");
  };

  return (
    <Button variant={"ghost"} onClick={openlink}>
      <OpenInNewWindowIcon className="w-5 h-5" strokeWidth={4} />
    </Button>
  );
};
