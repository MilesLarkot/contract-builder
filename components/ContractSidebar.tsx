import React from "react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, GripVertical } from "lucide-react";
import FieldEditor from "@/components/FieldEditor";
import { Contract, Section, Field, Party, PartyField } from "@/types";
import { Editor } from "@tiptap/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ContractSidebarProps = {
  contract: Contract;
  availableSections: Section[];
  suggestedFields: Field[];
  mode: "contract" | "template";
  editor: Editor | null;
  onContractChange: (field: string, value: string) => void;
  onFieldChange: (index: number, field: Field) => void;
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

const ContractSidebar = ({
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
}: ContractSidebarProps) => {
  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    sectionId: string
  ) => {
    e.dataTransfer.setData("sectionId", sectionId);
    e.dataTransfer.effectAllowed = "move";
    console.log("Dragging section:", sectionId);
  };

  return (
    <div className="p-4 h-full">
      <Tabs defaultValue="fields" className="h-full flex flex-col">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="fields">Fields</TabsTrigger>
          <TabsTrigger value="sections">Sections</TabsTrigger>
          <TabsTrigger value="parties">Parties</TabsTrigger>
        </TabsList>
        <div className="flex-grow overflow-y-auto">
          <TabsContent value="fields" className="mt-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Fields</h3>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onAddField}
                  title="Add new field"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {contract.fields.map((field, index) => (
                <FieldEditor
                  key={index}
                  field={field}
                  index={index}
                  onChange={(updatedField) =>
                    onFieldChange(index, updatedField)
                  }
                  onRemove={() => onRemoveField(index)}
                  content={contract.content}
                  onContentChange={(content) =>
                    onContractChange("content", content)
                  }
                  editor={editor}
                  mode={mode}
                />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="sections" className="mt-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Sections</h3>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onCreateSection}
                  title="Add new section"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Accordion type="single" collapsible className="w-full">
                {availableSections.map((section) => (
                  <AccordionItem key={section.id} value={section.id}>
                    <div className="flex items-center">
                      <div
                        draggable={!!section.title.trim()}
                        onDragStart={(e) => handleDragStart(e, section.id)}
                        className="cursor-move p-2"
                        title="Drag to move section"
                      >
                        <GripVertical className="h-4 w-4 text-gray-500" />
                      </div>
                      <AccordionTrigger className="flex-grow">
                        {section.title || "Untitled Section"}
                      </AccordionTrigger>
                    </div>
                    <AccordionContent>
                      <div className="space-y-2">
                        <div>
                          <Label htmlFor={`section-title-${section.id}`}>
                            Section Title
                          </Label>
                          <Input
                            id={`section-title-${section.id}`}
                            value={section.title}
                            onChange={(e) =>
                              onUpdateSection(
                                section.id,
                                "title",
                                e.target.value
                              )
                            }
                            placeholder="Enter section title"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`section-content-${section.id}`}>
                            Content
                          </Label>
                          <Textarea
                            id={`section-content-${section.id}`}
                            value={section.content}
                            onChange={(e) =>
                              onUpdateSection(
                                section.id,
                                "content",
                                e.target.value
                              )
                            }
                            placeholder="Enter section content"
                            className="min-h-[100px]"
                          />
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onAddSection(section)}
                          disabled={!section.content.trim()}
                        >
                          Add Section
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </TabsContent>
          <TabsContent value="parties" className="mt-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Parties</h3>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onAddParty}
                  title="Add new party"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {contract.parties.map((party) => (
                <div key={party.id} className="border p-2 rounded">
                  <div className="flex justify-between items-center">
                    <Input
                      value={party.name}
                      onChange={(e) =>
                        onUpdateParty(party.id, { name: e.target.value })
                      }
                      placeholder="Party name"
                      className="mb-2"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemoveParty(party.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <Select
                    value={party.type}
                    onValueChange={(value) =>
                      onPartyTypeChange(
                        party.id,
                        value as "company" | "individual"
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="company">Company</SelectItem>
                      <SelectItem value="individual">Individual</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="mt-2">
                    <div className="flex justify-between items-center mb-1">
                      <Label>Party Fields</Label>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onAddPartyField(party.id)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    {party.fields.map((field, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 mb-1"
                      >
                        <Input
                          value={field.name}
                          onChange={(e) =>
                            onUpdatePartyField(party.id, index, {
                              ...field,
                              name: e.target.value,
                            })
                          }
                          placeholder="Field name"
                          className="flex-grow"
                        />
                        <Input
                          value={field.value}
                          onChange={(e) =>
                            onUpdatePartyField(party.id, index, {
                              ...field,
                              value: e.target.value,
                            })
                          }
                          placeholder="Field value"
                          className="flex-grow"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onRemovePartyField(party.id, index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </div>
        {suggestedFields.length > 0 && (
          <div className="mt-2 h-[250px] overflow-auto border-t-2 pt-2">
            <h4 className="text-sm font-medium mb-1">Suggested Fields</h4>
            <div className="space-y-1">
              {suggestedFields.map((field, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-left"
                  onClick={() => onAddSuggestedField(field)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {field.name}
                </Button>
              ))}
            </div>
          </div>
        )}
      </Tabs>
    </div>
  );
};

export default ContractSidebar;
