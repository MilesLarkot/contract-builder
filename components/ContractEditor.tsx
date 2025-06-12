import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Save } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import FontFamily from "@tiptap/extension-font-family";
import TextAlign from "@tiptap/extension-text-align";
import Blockquote from "@tiptap/extension-blockquote";
import ContractEditorModal from "@/components/ContractEditorModal";
import ContractSidebar from "@/components/ContractSidebar";
import EditorToolbar from "@/components/EditorToolbar";
import DummyContractData from "@/components/DummyContractData";
import { Contract, Section, Field, Party, PartyField } from "@/types";
import ContractPreview from "@/components/ContractPreview";

type ContractEditorProps = {
  initialContract?: Contract | null;
  mode: "contract" | "template";
};

const ContractEditor = ({
  initialContract = null,
  mode,
}: ContractEditorProps) => {
  const [contract, setContract] = useState<Contract>(
    initialContract || {
      title: DummyContractData.title,
      description: DummyContractData.description,
      content: DummyContractData.content,
      fields: DummyContractData.fields,
      sections: [],
      parties: [],
    }
  );
  const [availableSections, setAvailableSections] = useState<Section[]>([]);
  const [activeTab, setActiveTab] = useState<"details" | "preview">("details");
  const [modalTab, setModalTab] = useState<"sections" | "fields" | "parties">(
    "sections"
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  // const touchTimerRef = useRef<NodeJS.Timeout | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Heading,
      BulletList,
      OrderedList,
      ListItem,
      TextStyle,
      Color,
      FontFamily,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Blockquote,
    ],
    content: contract.content,
    onUpdate: ({ editor }) => {
      setContract((prev) => ({ ...prev, content: editor.getHTML() }));
    },
  });

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const mockSections = [
          {
            id: "s1",
            title: "Introduction",
            content: "This agreement is made between §{party1} and §{party2}.",
            fields: [
              {
                name: "party1",
                type: "text",
                options: [],
                value: "",
                mapping: "collaborator.name",
                required: true,
              },
              {
                name: "party2",
                type: "text",
                options: [],
                value: "",
                mapping: "",
                required: true,
              },
            ],
          },
          {
            id: "s2",
            title: "Terms & Conditions",
            content:
              "The terms of this agreement will be valid for §{duration} months.",
            fields: [
              {
                name: "duration",
                type: "number",
                options: [],
                value: "",
                mapping: "",
                required: true,
              },
            ],
          },
        ];
        setAvailableSections(mockSections);
      } catch (error) {
        console.error("Error fetching sections:", error);
      }
    };
    fetchSections();
  }, []);

  useEffect(() => {
    if (editor && contract.content !== editor.getHTML()) {
      editor.commands.setContent(contract.content, false);
    }
  }, [contract.content, editor]);

  const suggestedFields: Field[] = [
    {
      name: "effectiveDate",
      type: "date",
      options: [],
      value: "",
      mapping: "",
      required: true,
    },
    {
      name: "amount",
      type: "number",
      options: [],
      value: "",
      mapping: "",
      required: false,
    },
    {
      name: "email",
      type: "email",
      options: [],
      value: "",
      mapping: "",
      required: false,
    },
  ];

  const handleContractChange = (field: string, value: unknown) => {
    setContract((prev) => ({ ...prev, [field]: value as string }));
  };

  const handleFieldChange = (index: number, updatedField: Field) => {
    setContract((prev) => {
      const fields = [...prev.fields];
      fields[index] = updatedField;
      return { ...prev, fields };
    });
  };

  const removeField = (index: number) => {
    setContract((prev) => {
      const fields = [...prev.fields];
      fields.splice(index, 1);
      return { ...prev, fields };
    });
  };

  const addField = () => {
    setContract((prev) => ({
      ...prev,
      fields: [
        ...prev.fields,
        {
          name: "",
          type: "text",
          options: [],
          value: "",
          mapping: "",
          required: false,
        },
      ],
    }));
  };

  const addSuggestedField = (field: Field) => {
    setContract((prev) => ({ ...prev, fields: [...prev.fields, field] }));
  };

  const extractFieldsFromContent = (content: string) => {
    const placeholderRegex = /§\{([^}]+)\}/g;
    const fields: string[] = [];
    let match;
    while ((match = placeholderRegex.exec(content)) !== null) {
      fields.push(match[1]);
    }
    return fields;
  };

  const addSectionToContent = (section: Section) => {
    if (!section.content.trim()) return;
    const newContent = contract.content
      ? `${contract.content}<p>${section.content}</p>`
      : `<p>${section.content}</p>`;
    const sectionFields = extractFieldsFromContent(section.content);
    const newFields = sectionFields
      .filter((fieldName) => !contract.fields.some((f) => f.name === fieldName))
      .map((fieldName) => ({
        name: fieldName,
        type: "text",
        options: [],
        value: "",
        mapping: "",
        required: false,
      }));
    setContract((prev) => ({
      ...prev,
      content: newContent,
      sections: [...prev.sections, section],
      fields: [...prev.fields, ...newFields],
    }));
    if (editor) {
      editor.commands.insertContent(`<p>${section.content}</p>`);
    }
  };

  const updateAvailableSection = (
    sectionId: string,
    field: string,
    value: string
  ) => {
    setAvailableSections((prev) =>
      prev.map((section) =>
        section.id === sectionId ? { ...section, [field]: value } : section
      )
    );
  };

  const createNewSection = () => {
    setAvailableSections((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        title: "",
        content: "",
        fields: [],
      },
    ]);
  };

  const addParty = () => {
    setContract((prev) => ({
      ...prev,
      parties: [
        ...prev.parties,
        {
          id: Math.random().toString(),
          name: "",
          type: "company",
          fields: [],
        },
      ],
    }));
  };

  const updateParty = (partyId: string, updatedParty: Partial<Party>) => {
    setContract((prev) => ({
      ...prev,
      parties: prev.parties.map((party) =>
        party.id === partyId ? { ...party, ...updatedParty } : party
      ),
    }));
  };

  const removeParty = (partyId: string) => {
    setContract((prev) => ({
      ...prev,
      parties: prev.parties.filter((party) => party.id !== partyId),
    }));
  };

  const addPartyField = (partyId: string) => {
    setContract((prev) => ({
      ...prev,
      parties: prev.parties.map((party) =>
        party.id === partyId
          ? {
              ...party,
              fields: [
                ...party.fields,
                { name: "", type: "text", value: "", required: false },
              ],
            }
          : party
      ),
    }));
  };

  const updatePartyField = (
    partyId: string,
    fieldIndex: number,
    updatedField: PartyField
  ) => {
    setContract((prev) => ({
      ...prev,
      parties: prev.parties.map((party) =>
        party.id === partyId
          ? {
              ...party,
              fields: party.fields.map((field, idx) =>
                idx === fieldIndex ? updatedField : field
              ),
            }
          : party
      ),
    }));
  };

  const removePartyField = (partyId: string, fieldIndex: number) => {
    setContract((prev) => ({
      ...prev,
      parties: prev.parties.map((party) =>
        party.id === partyId
          ? {
              ...party,
              fields: party.fields.filter((_, idx) => idx !== fieldIndex),
            }
          : party
      ),
    }));
  };

  const handlePartyTypeChange = (
    partyId: string,
    type: "company" | "individual"
  ) => {
    setContract((prev) => ({
      ...prev,
      parties: prev.parties.map((party) =>
        party.id === partyId ? { ...party, type } : party
      ),
    }));
  };

  const saveContract = () => {
    console.log("Saving contract:", contract);
  };

  return (
    <div className="flex h-full relative flex-col sm:flex-row">
      <div
        className={`flex-grow p-6 ${
          activeTab === "details"
            ? "sm:mr-[320px] sm:ml-[320px]"
            : "sm:ml-[320px]"
        }`}
      >
        <div className="mb-6 flex flex-col space-y-4">
          {/* <h1 className="text-2xl font-bold">
            {mode === "contract" ? "Contract Editor" : "Template Editor"}
          </h1> */}
          <div className="flex justify-between items-center">
            <Tabs
              value={activeTab}
              onValueChange={(value) =>
                setActiveTab(value as "details" | "preview")
              }
            >
              <TabsList>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button onClick={saveContract} className="hidden sm:block">
              Save {mode === "contract" ? "Contract" : "Template"}
            </Button>
          </div>
        </div>

        <Tabs value={activeTab}>
          <TabsContent value="details">
            <Card>
              {/* <CardHeader>
                <CardTitle>Contract Details</CardTitle>
              </CardHeader> */}
              <CardContent>
                <div className="space-y-4 mt-3">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={contract.title}
                      onChange={(e) =>
                        handleContractChange("title", e.target.value)
                      }
                      placeholder="Contract title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="content">Content</Label>
                    <EditorToolbar editor={editor} />
                    <EditorContent
                      editor={editor}
                      className="border rounded-md p-2 prose max-w-none"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Use <code>§&#123;placeholder&#125;</code> for dynamic
                      content that will be filled from field values.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="preview">
            <ContractPreview contract={contract} mode={mode} />
          </TabsContent>
        </Tabs>
      </div>

      {activeTab === "details" && (
        <div className="hidden sm:block fixed top-0 right-0 w-80 h-full border-l bg-gray-50 min-w-[300px] overflow-y-auto overflow-x-hidden">
          <ContractSidebar
            contract={contract}
            availableSections={availableSections}
            suggestedFields={suggestedFields}
            mode={mode}
            editor={editor}
            onContractChange={handleContractChange}
            onFieldChange={handleFieldChange}
            onRemoveField={removeField}
            onAddField={addField}
            onAddSuggestedField={addSuggestedField}
            onAddSection={addSectionToContent}
            onUpdateSection={updateAvailableSection}
            onCreateSection={createNewSection}
            onAddParty={addParty}
            onUpdateParty={updateParty}
            onRemoveParty={removeParty}
            onAddPartyField={addPartyField}
            onUpdatePartyField={updatePartyField}
            onRemovePartyField={removePartyField}
            onPartyTypeChange={handlePartyTypeChange}
          />
        </div>
      )}

      {activeTab === "details" && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-50 border-t p-2 grid grid-cols-3 gap-2 sm:hidden z-50">
          <Button
            variant={modalTab === "sections" ? "default" : "outline"}
            onClick={() => {
              setModalTab("sections");
              setIsModalOpen(true);
            }}
            aria-label="View Sections"
          >
            Sections
          </Button>
          <Button
            variant={modalTab === "fields" ? "default" : "outline"}
            onClick={() => {
              setModalTab("fields");
              setIsModalOpen(true);
            }}
            aria-label="View Fields"
          >
            Fields
          </Button>
          <Button
            variant={modalTab === "parties" ? "default" : "outline"}
            onClick={() => {
              setModalTab("parties");
              setIsModalOpen(true);
            }}
            aria-label="View Parties"
          >
            Parties
          </Button>
        </div>
      )}

      <ContractEditorModal
        isModalOpen={isModalOpen}
        isDrawerOpen={isDrawerOpen}
        activeTab={modalTab}
        contract={contract}
        availableSections={availableSections}
        suggestedFields={suggestedFields}
        mode={mode}
        editor={editor}
        onModalOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) setModalTab("sections");
        }}
        onDrawerOpenChange={setIsDrawerOpen}
        onContractChange={handleContractChange}
        onFieldChange={handleFieldChange}
        onRemoveField={removeField}
        onAddField={addField}
        onAddSuggestedField={addSuggestedField}
        onAddSection={addSectionToContent}
        onUpdateSection={updateAvailableSection}
        onCreateSection={createNewSection}
        onAddParty={addParty}
        onUpdateParty={updateParty}
        onRemoveParty={removeParty}
        onAddPartyField={addPartyField}
        onUpdatePartyField={updatePartyField}
        onRemovePartyField={removePartyField}
        onPartyTypeChange={handlePartyTypeChange}
      />

      <Button
        onClick={saveContract}
        className={`sm:hidden fixed right-6 rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:shadow-xl bg-primary text-primary-foreground z-50 ${
          activeTab === "details" ? "bottom-20" : "bottom-8"
        }`}
        title={`Save ${mode === "contract" ? "Contract" : "Template"}`}
      >
        <Save className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default ContractEditor;
