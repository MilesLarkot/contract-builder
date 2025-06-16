import { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Contract, Section, Field, Party, PartyField } from "@/types";
import { Editor } from "@tiptap/react";
import ContractSidebar from "@/components/ContractSidebar";

type ContractMobileControlsProps = {
  contract: Contract;
  availableSections: Section[];
  suggestedFields: Field[];
  mode: "contract" | "template";
  editor: Editor | null;
  onContractChange: (field: string, value: unknown) => void;
  onFieldChange: (index: number, updatedField: Field) => void;
  onRemoveField: (index: number) => void;
  onAddField: () => void;
  onAddSuggestedField: (field: Field) => void;
  onAddSection: (section: Section) => void;
  onUpdateSection: (sectionId: string, field: string, value: string) => void;
  onCreateSection: () => void;
  onAddParty: () => void;
  onUpdateParty: (partyId: string, updatedParty: Partial<Party>) => void;
  onRemoveParty: (partyId: string) => void;
  onAddPartyField: (partyId: string) => void;
  onUpdatePartyField: (
    partyId: string,
    fieldIndex: number,
    updatedField: PartyField
  ) => void;
  onRemovePartyField: (partyId: string, fieldIndex: number) => void;
  onPartyTypeChange: (partyId: string, type: "company" | "individual") => void;
};

const ContractMobileControls = ({
  contract,
  availableSections,
  suggestedFields,
  mode,
  editor,
  onContractChange,
  onFieldChange,
  onRemoveField,
  onAddField,
  onAddSuggestedField,
  onAddSection,
  onUpdateSection,
  onCreateSection,
  onAddParty,
  onUpdateParty,
  onRemoveParty,
  onAddPartyField,
  onUpdatePartyField,
  onRemovePartyField,
  onPartyTypeChange,
}: ContractMobileControlsProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"fields" | "sections" | "parties">(
    "fields"
  );

  const openDrawer = (tab: "fields" | "sections" | "parties") => {
    setActiveTab(tab);
    setIsDrawerOpen(true);
  };

  return (
    <>
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-gray-50 border-t p-2 grid grid-cols-3 gap-2 z-40">
        <Button
          variant="outline"
          onClick={() => openDrawer("fields")}
          aria-label="View Fields"
        >
          Fields
        </Button>
        <Button
          variant="outline"
          onClick={() => openDrawer("sections")}
          aria-label="View Sections"
        >
          Sections
        </Button>
        <Button
          variant="outline"
          onClick={() => openDrawer("parties")}
          aria-label="View Parties"
        >
          Parties
        </Button>
      </div>

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="h-[80vh] max-w-[350px] mx-auto">
          <DrawerHeader>
            <DrawerTitle>
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </DrawerTitle>
          </DrawerHeader>
          <div className="p-4 overflow-y-auto h-[calc(80vh-80px)] mx-auto">
            <ContractSidebar
              contract={contract}
              availableSections={availableSections}
              suggestedFields={suggestedFields}
              mode={mode}
              editor={editor}
              onContractChange={onContractChange}
              onFieldChange={onFieldChange}
              onRemoveField={onRemoveField}
              onAddField={onAddField}
              onAddSuggestedField={onAddSuggestedField}
              onAddSection={onAddSection}
              onUpdateSection={onUpdateSection}
              onCreateSection={onCreateSection}
              onAddParty={onAddParty}
              onUpdateParty={onUpdateParty}
              onRemoveParty={onRemoveParty}
              onAddPartyField={onAddPartyField}
              onUpdatePartyField={onUpdatePartyField}
              onRemovePartyField={onRemovePartyField}
              onPartyTypeChange={onPartyTypeChange}
              showTabs={false}
            />
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default ContractMobileControls;
