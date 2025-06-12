import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import FieldEditor from "@/components/FieldEditor";
import { Editor } from "@tiptap/react";
import type { Contract, Section, Field, Party, PartyField } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ContractSidebarProps = {
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
  return (
    <div className="w-80 h-full border-l bg-gray-50 p-4 min-w-[300px] overflow-y-auto">
      <Tabs defaultValue="fields" className="w-full">
        <TabsList className="grid w-full grid-cols-3 gap-2">
          <TabsTrigger value="fields">Fields</TabsTrigger>
          <TabsTrigger value="sections">Sections</TabsTrigger>
          <TabsTrigger value="parties">Parties</TabsTrigger>
        </TabsList>
        <TabsContent value="sections">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Available Sections</h2>
            <Button onClick={onCreateSection} size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-1" /> New Section
            </Button>
          </div>
          <ScrollArea className="h-[calc(100vh-160px)]">
            <div className="space-y-3">
              {availableSections.map((section) => (
                <Card key={section.id} className="hover:bg-gray-100">
                  <CardContent className="p-3">
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <Input
                          value={section.title}
                          onChange={(e) =>
                            onUpdateSection(section.id, "title", e.target.value)
                          }
                          placeholder="Section title"
                          className="flex-grow"
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onAddSection(section)}
                          disabled={!section.content.trim()}
                          title="Add section content to contract"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <Textarea
                        value={section.content}
                        onChange={(e) =>
                          onUpdateSection(section.id, "content", e.target.value)
                        }
                        placeholder="Section content with <span>placeholders</span>"
                        rows={3}
                        className="flex-grow"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="fields">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Contract Fields</h2>
            <Button onClick={onAddField} size="sm" variant="outline">
              <Plus className="h-4 w-4" /> Add Field
            </Button>
          </div>
          <ScrollArea className="h-[calc(100vh-160px)]">
            <div className="space-y-3">
              {contract.fields.map((field, index) => (
                <FieldEditor
                  key={field.name || `field-${index}`}
                  field={field}
                  index={index}
                  onChange={(updatedField) =>
                    onFieldChange(index, updatedField)
                  }
                  onRemove={() => onRemoveField(index)}
                  content={contract.content}
                  onContentChange={onContractChange.bind(null, "content")}
                  editor={editor}
                  mode={mode}
                />
              ))}
              <div className="mt-6">
                <h3 className="font-semibold mb-2">Suggested Fields</h3>
                <div className="space-y-2">
                  {suggestedFields.map((field, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-100 rounded-md"
                    >
                      <span>
                        {field.name} ({field.type})
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onAddSuggestedField(field)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="parties">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Parties</h2>
            <Button onClick={onAddParty} size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" /> Add Party
            </Button>
          </div>
          <ScrollArea className="h-[calc(100vh-160px)]">
            <div className="space-y-3">
              {contract.parties.map((party) => (
                <Card key={party.id} className="p-3">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Input
                        value={party.name}
                        onChange={(e) =>
                          onUpdateParty(party.id, { name: e.target.value })
                        }
                        placeholder="Party name (e.g., company1)"
                        className="flex-grow"
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onRemoveParty(party.id)}
                        title="Remove party"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <Select
                      value={party.type}
                      onValueChange={(value: "company" | "individual") =>
                        onPartyTypeChange(party.id, value)
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
                    <div className="space-y-2">
                      {party.fields.map((field, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2"
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
                            disabled={field.required}
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
                            disabled={mode === "template"}
                            className="flex-grow"
                          />
                          {!field.required && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                onRemovePartyField(party.id, index)
                              }
                              title="Remove field"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onAddPartyField(party.id)}
                      >
                        <Plus className="h-4 w-4 mr-1" /> Add Field
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContractSidebar;
