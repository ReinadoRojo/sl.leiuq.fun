"use client";

import { Button } from "@/components/ui/button";

export const CopyCatButton = ({svalue}: {svalue: string}) => {
    const handleCopy = (e: any) => {
        const thisValue = e.currentTarget.value;
        const thisUrl = `${window.location.origin}`;

        navigator.clipboard.writeText(`${thisUrl}/${svalue}`)
            .then(() => {
                console.log('Copied to clipboard:', `${thisUrl}/${svalue}`);
            })
            .catch((error) => {
                console.error('Error copying to clipboard:', error);
            });
    }

    return (
        <Button variant={"ghost"} onClick={handleCopy}>
            {svalue}
        </Button>
    )
}