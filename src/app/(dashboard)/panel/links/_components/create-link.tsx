"use client";

import { makeLongShort } from "@/actions/links-actions"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export function CreateLinkModal() {
  const [modalOpen, setModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter()

  const handleCreation = (formData: FormData) => {
    startTransition(() => {
      makeLongShort(formData)
      .then((response) => {
        if(response.code != "success") {toast.error(response.error); return;}
        
        toast.success("The link was successfully created!")
        setModalOpen(false);
        router.refresh();
      })
    })
  }

  return (
    <Dialog open={modalOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setModalOpen(true)}>Create link</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create new link</DialogTitle>
          <DialogDescription>
            Complete all the fields and click on Create to create a link.
          </DialogDescription>
        </DialogHeader>
        <form className="grid gap-4 py-4" action={handleCreation}>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="longurl" className="text-right">
              Long URL
            </Label>
            <Input id="longurl" placeholder="https://..." className="col-span-3" required name="longurl" disabled={isPending}/>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="shortslug" className="text-right">
              Short slug
            </Label>
            <Input id="shortslug" placeholder="We are working on this feature" className="col-span-3" name="shortslug" disabled/>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
