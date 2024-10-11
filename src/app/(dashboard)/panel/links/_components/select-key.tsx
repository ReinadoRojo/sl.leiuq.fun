"use client";

import { useApiKeySelected } from "@/app/(dashboard)/_components/selected-key-provider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { PlusIcon } from "@radix-ui/react-icons";

export function SelectApiKey({
  apiKeyList,
}: {
  apiKeyList: { apiToken: string }[];
}) {
  const router = useRouter();
  const { apiKeySelected, selectApiKey } = useApiKeySelected();

  const handleValueChange = (value: string) => {
    switch (value) {
      case "create":
      case "No api keys found":
        router.push("/panel/tokens/create");
        break;

      default:
        selectApiKey(value);
    }
  };

  return (
    <div className="flex flex-row py-4 max-w-[30rem] gap-4">
      <Select onValueChange={handleValueChange}>
        <SelectTrigger id="apikey-selector" aria-label="Select api key">
          <SelectValue placeholder={apiKeySelected || "Select api key"} />
        </SelectTrigger>
        <SelectContent>
          {apiKeyList.map((apiKey) => (
            <SelectItem key={apiKey.apiToken} value={apiKey.apiToken}>
              {apiKey.apiToken}
            </SelectItem>
          ))}
          {apiKeyList.length === 0 && (
            <>
              <SelectItem value="No api keys found" disabled>
                No api keys found
              </SelectItem>
              <SelectItem
                value="create"
                className="cursor-pointer text-sm font-medium flex items-center gap-2"
              >
                <PlusIcon className="h-4 w-4 text-muted-foreground inline translate-y-[-0.05rem]" />{" "}
                Create new
              </SelectItem>
            </>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
