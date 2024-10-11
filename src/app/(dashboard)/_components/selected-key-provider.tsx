"use client";
import { createContext, useState, ReactNode, useContext } from "react";

interface ApiKeyContextValue {
  apiKeySelected: string;
  selectApiKey: (apiKey: string) => void;
}

export const ApiKeySelectedContext = createContext<
  ApiKeyContextValue | undefined
>(undefined);

export const ApiKeySelectedProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [apiKeySelected, setApiKeySelected] = useState<string>("");

  const selectApiKey = (apiKey: string) => setApiKeySelected(apiKey);

  return (
    <ApiKeySelectedContext.Provider value={{ apiKeySelected, selectApiKey }}>
      {children}
    </ApiKeySelectedContext.Provider>
  );
};

export const useApiKeySelected = () => {
  const context = useContext(ApiKeySelectedContext);
  if (!context) {
    throw new Error(
      "useApiKeySelected must be used within a ApiKeySelectedProvider"
    );
  }
  return context;
};
