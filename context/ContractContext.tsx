import { createContext, useContext } from "react";
import type { Contract } from "@/types";
import useContractEditor from "@/hooks/use-contract-editor";

type ContractContextType = ReturnType<typeof useContractEditor>;

const ContractContext = createContext<ContractContextType | undefined>(
  undefined
);

export const ContractProvider = ({
  initialContract,
  mode,
  children,
}: {
  initialContract: Contract | null;
  mode: "contract" | "template";
  children: React.ReactNode;
}) => {
  const value = useContractEditor({ initialContract, mode });
  return (
    <ContractContext.Provider value={value}>
      {children}
    </ContractContext.Provider>
  );
};

export const useContract = () => {
  const context = useContext(ContractContext);
  if (!context) {
    throw new Error("useContract must be used within a ContractProvider");
  }
  return context;
};
