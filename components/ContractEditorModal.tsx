import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { X } from "lucide-react";
import ContractSidebar from "@/components/ContractSidebar";
import { Contract, Section, Field, Party, PartyField } from "@/types";
import { Editor } from "@tiptap/react";

type ContractEditorModalProps = {
  isModalOpen: boolean;
  isDrawerOpen: boolean;
  activeTab: string;
  contract: Contract;
  availableSections: Section[];
  suggestedFields: Field[];
  mode: "contract" | "template";
  editor: Editor | null;
  onModalOpenChange: (open: boolean) => void;
  onDrawerOpenChange: (open: boolean) => void;
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

const ContractEditorModal = ({
  isModalOpen,
  isDrawerOpen,
  activeTab,
  contract,
  availableSections,
  suggestedFields,
  mode,
  editor,
  onModalOpenChange,
  onDrawerOpenChange,
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
}: ContractEditorModalProps) => {
  return (
    <>
      <Dialog open={isModalOpen} onOpenChange={onModalOpenChange}>
        <DialogContent className="w-fit max-w-[90vw] max-h-[80vh] p-0">
          <DialogHeader className="p-4 pb-0">
            <div className="flex justify-between items-center">
              <DialogTitle>
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onModalOpenChange(false)}
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          <div className="p-4">
            <Tabs value={activeTab} className="w-full">
              <TabsContent value={activeTab}>
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
                />
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>

      <Drawer open={isDrawerOpen} onOpenChange={onDrawerOpenChange}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Select an Option</DrawerTitle>
            <DrawerDescription>
              Choose a section to edit the {mode}.
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 space-y-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                onDrawerOpenChange(false);
                onModalOpenChange(true);
              }}
            >
              Sections
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                onDrawerOpenChange(false);
                onModalOpenChange(true);
              }}
            >
              Fields
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                onDrawerOpenChange(false);
                onModalOpenChange(true);
              }}
            >
              Parties
            </Button>
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default ContractEditorModal;
