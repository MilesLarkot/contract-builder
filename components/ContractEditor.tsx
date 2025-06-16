import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Save } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import ContractSidebar from "@/components/ContractSidebar";
import EditorToolbar from "@/components/EditorToolbar";
import DummyContractData from "@/components/DummyContractData";
import { Contract, Section, Field, Party, PartyField } from "@/types";
import ContractPreview from "@/components/ContractPreview";
import PlaceholderExtension from "./ui/PlaceholderExtension";
import ContractMobileControls from "@/components/ContractMobileControls";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import "@/components/ContractEditor.module.css";

type ContractEditorProps = {
  initialContract?: Contract | null;
  mode: "contract" | "template";
};

const ContractEditor = ({
  initialContract = null,
  mode,
}: ContractEditorProps) => {
  const normalizeContent = (content: string) => {
    return content.replace(
      /<span>([^<]+)<\/span>/g,
      (match, fieldName) =>
        `<span data-placeholder="${fieldName}">${fieldName}</span>`
    );
  };

  const [contract, setContract] = useState<Contract>(() => {
    const initial = initialContract || {
      title: DummyContractData.title,
      description: DummyContractData.description,
      content: DummyContractData.content,
      fields: DummyContractData.fields,
      sections: [],
      parties: [],
    };
    return {
      ...initial,
      content: normalizeContent(initial.content),
    };
  });
  const [availableSections, setAvailableSections] = useState<Section[]>([]);
  const [activeTab, setActiveTab] = useState<"details" | "preview">("details");
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showTitleError, setShowTitleError] = useState(false);
  const [editingField, setEditingField] = useState<{
    name: string;
    value: string;
  } | null>(null);
  const isUpdatingFromEditor = useRef(false);
  const editorContainerRef = useRef<HTMLDivElement>(null);

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
      PlaceholderExtension.configure({
        fields: contract.fields,
        onEditField: (fieldName: string, currentValue: string) => {
          setEditingField({ name: fieldName, value: currentValue });
        },
      }),
    ],
    content: contract.content,
    onUpdate: ({ editor }) => {
      isUpdatingFromEditor.current = true;
      const html = editor.getHTML();
      setContract((prev) => ({ ...prev, content: html }));
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && contract.content && !isUpdatingFromEditor.current) {
      editor.commands.setContent(normalizeContent(contract.content), false, {
        preserveWhitespace: true,
      });
      setIsEditorReady(true);
    }
    isUpdatingFromEditor.current = false;
  }, [contract.content, editor, contract.fields]);

  useEffect(() => {
    if (editor && isEditorReady) {
      editor.extensionManager.extensions.forEach((extension) => {
        if (extension.name === "placeholder") {
          extension.options.fields = contract.fields;
        }
      });
      editor.commands.setContent(editor.getHTML(), false, {
        preserveWhitespace: true,
      });
    }
  }, [contract.fields, editor, isEditorReady]);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const mockSections = [
          {
            id: "s1",
            title: "Introduction",
            content:
              "This agreement is made between <span>party1</span> and <span>party2</span>.",
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
              "The terms of this agreement will be valid for <span>duration</span> months.",
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
      } catch (error) {}
    };
    fetchSections();
  }, []);

  const suggestedFields: Field[] = [
    {
      name: "effectiveDate",
      type: "date",
      options: [],
      value: "",
      mapping: "",
    },
    {
      name: "amount",
      type: "number",
      options: [],
      value: "",
      mapping: "",
    },
    {
      name: "email",
      type: "email",
      options: [],
      value: "",
      mapping: "",
    },
  ];

  const handleContractChange = (field: string, value: unknown) => {
    setContract((prev) => ({ ...prev, [field]: value as string }));
    if (field === "title") {
      setShowTitleError((value as string).trim() === "");
    }
  };

  const handleFieldChange = (index: number, updatedField: Field) => {
    setContract((prev) => {
      const fields = [...prev.fields];
      fields[index] = updatedField;
      return { ...prev, fields };
    });
  };

  const handleEditField = (fieldName: string, newValue: string) => {
    setContract((prev) => {
      const fields = prev.fields.map((field) =>
        field.name === fieldName ? { ...field, value: newValue } : field
      );
      return { ...prev, fields };
    });
    setEditingField(null);
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
    const placeholderRegex = /<span data-placeholder="([^"]+)"/g;
    const fields: string[] = [];
    let match;
    while ((match = placeholderRegex.exec(content))) {
      fields.push(match[1]);
    }
    return fields;
  };

  const addSectionToContent = (section: Section) => {
    if (!section.content.trim()) return;
    const normalizedSectionContent = normalizeContent(section.content);
    const newContent = contract.content
      ? `${contract.content}<p>${normalizedSectionContent}</p>`
      : `<p>${normalizedSectionContent}</p>`;
    const sectionFields = extractFieldsFromContent(normalizedSectionContent);
    const newFields = sectionFields
      .filter((fieldName) => !contract.fields.some((f) => f.name === fieldName))
      .map((fieldName) => {
        const existingField = section.fields?.find((f) => f.name === fieldName);
        return (
          existingField || {
            name: fieldName,
            type: "text",
            options: [],
            value: "",
            mapping: "",
          }
        );
      });
    setContract((prev) => ({
      ...prev,
      content: newContent,
      sections: [...prev.sections, section],
      fields: [...prev.fields, ...newFields],
    }));
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

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!editor) {
      return;
    }

    const rect = editorContainerRef.current?.getBoundingClientRect();
    let position = null;
    if (rect) {
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;
      position = editor.view.posAtCoords({ left: e.clientX, top: e.clientY });
    }

    const sectionId = e.dataTransfer.getData("sectionId");
    if (sectionId) {
      const section = availableSections.find((s) => s.id === sectionId);
      if (!section) {
        return;
      }

      const normalizedSectionContent = normalizeContent(section.content);
      const insertPos = position?.pos ?? editor.state.doc.content.size;
      editor
        .chain()
        .setTextSelection(insertPos)
        .insertContent(`<p>${normalizedSectionContent}</p>`)
        .setTextSelection(insertPos + normalizedSectionContent.length + 7)
        .run();

      addSectionToContent(section);
      return;
    }

    const fieldName = e.dataTransfer.getData("fieldName");
    if (!fieldName) {
      return;
    }

    const insertPos = position?.pos ?? editor.state.doc.content.size;
    editor
      .chain()
      .setTextSelection(insertPos)
      .insertContent({
        type: "placeholder",
        attrs: { placeholder: fieldName },
      })
      .insertContent(" ")
      .setTextSelection(insertPos + fieldName.length + 1)
      .run();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && editingField) {
      handleEditField(editingField.name, editingField.value);
    }
  };

  const debounce = <T extends (...args: unknown[]) => void>(
    func: T,
    delay: number
  ) => {
    let timeoutId: ReturnType<typeof setTimeout>;
    const debounced = (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
    debounced.cancel = () => clearTimeout(timeoutId);
    return debounced;
  };

  const saveContract = async () => {
    if (contract.title.trim() === "") {
      setShowTitleError(true);
      return;
    }
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
    } finally {
      setIsSaving(false);
    }
  };

  const debouncedSave = useCallback(debounce(saveContract, 5000), [
    saveContract,
  ]);

  useEffect(() => {
    debouncedSave();
    return () => {
      debouncedSave.cancel();
    };
  }, [contract, debouncedSave]);

  if (!isEditorReady) {
    return <div>Loading editor...</div>;
  }

  return (
    <div className="flex h-full flex-col sm:flex-row w-full">
      <div
        className={`flex-grow p-6 ${
          activeTab === "details"
            ? "sm:mr-[320px] sm:ml-[320px]"
            : "sm:ml-[320px]"
        }`}
      >
        <div className="mb-6 flex flex-col space-y-4">
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
            <Button
              onClick={saveContract}
              disabled={isSaving}
              variant={isSaving ? "outline" : "default"}
              className="hidden sm:block"
            >
              {isSaving
                ? "Saving..."
                : `Save ${mode === "contract" ? "Contract" : "Template"}`}
            </Button>
          </div>
        </div>

        <Tabs value={activeTab}>
          <TabsContent value="details">
            <Card>
              <CardContent>
                <div className="space-y-4 mt-3">
                  <div>
                    <Label htmlFor="title">
                      <b>Title</b>
                    </Label>
                    <Input
                      id="title"
                      value={contract.title}
                      onChange={(e) =>
                        handleContractChange("title", e.target.value)
                      }
                      placeholder="Contract title"
                    />
                    {showTitleError && (
                      <p className="text-red-500 text-sm mt-1">
                        Title is required for saving
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="description">
                      <b>Description</b>
                    </Label>
                    <Textarea
                      id="description"
                      value={contract.description}
                      onChange={(e) =>
                        handleContractChange("description", e.target.value)
                      }
                      placeholder="Contract description"
                      className=""
                    />
                  </div>
                  <div>
                    <Label htmlFor="content">
                      <b>Content</b>
                    </Label>
                    <EditorToolbar editor={editor} />
                    <div ref={editorContainerRef}>
                      <EditorContent
                        editor={editor}
                        className="border rounded-md p-6 prose max-w-none"
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                      />
                    </div>
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
        <ContractMobileControls
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
      )}

      {editingField && (
        <Popover
          open={!!editingField}
          onOpenChange={() => setEditingField(null)}
        >
          <PopoverTrigger asChild>
            <span className="hidden" />
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <div className="space-y-2">
              <Label htmlFor="field-value">Edit {editingField.name}</Label>
              <Input
                id="field-value"
                value={editingField.value}
                onChange={(e) =>
                  setEditingField({ ...editingField, value: e.target.value })
                }
                onKeyDown={handleKeyDown}
                placeholder="Enter value"
                autoFocus
              />
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingField(null)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={() =>
                    handleEditField(editingField.name, editingField.value)
                  }
                >
                  Save
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}

      <Button
        onClick={saveContract}
        disabled={isSaving}
        variant={isSaving ? "outline" : "default"}
        className={`sm:hidden fixed right-6 rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:shadow-xl bg-primary text-primary-foreground z-50 ${
          activeTab === "details" ? "bottom-20" : "bottom-6"
        }`}
        title={`Save ${mode === "contract" ? "Contract" : "Template"}`}
      >
        {isSaving ? (
          <span className="animate-spin">↻</span>
        ) : (
          <Save className="h-6 w-6" />
        )}
      </Button>
    </div>
  );
};

export default ContractEditor;
