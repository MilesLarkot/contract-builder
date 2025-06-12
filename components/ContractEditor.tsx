import { useState, useEffect, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Plus,
  Trash2,
  MoveVertical,
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  AlignCenter,
  AlignJustify,
  Save,
  X,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "./ui/textarea";
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
import type { DropResult } from "react-beautiful-dnd";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import styles from "./ContractEditor.module.css";
import SectionEditor from "@/components/SectionEditor";
import FieldEditor from "@/components/FieldEditor";
import DummyContractData from "@/components/DummyContractData";

type Field = {
  name: string;
  type: string;
  options: any[];
  value: string;
  mapping: string;
  required: boolean;
};

type PartyField = {
  name: string;
  type: string;
  value: string;
  required: boolean;
};

type Party = {
  id: string;
  name: string;
  type: "company" | "individual";
  fields: PartyField[];
};

type Section = {
  id: string;
  title: string;
  content: string;
  fields: Field[];
};

type Contract = {
  title: string;
  description: string;
  content: string;
  fields: Field[];
  sections: Section[];
  parties: Party[];
};

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
  const [activeTab, setActiveTab] = useState("details");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const touchTimerRef = useRef<NodeJS.Timeout | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Heading.configure({
        levels: [1, 2, 3],
      }),
      BulletList,
      OrderedList,
      ListItem,
      TextStyle,
      Color,
      FontFamily.configure({
        types: ["textStyle"],
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["center", "justify"],
      }),
      Blockquote,
    ],
    content: contract.content,
    onUpdate: ({ editor }) => {
      handleContractChange("content", editor.getHTML());
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

  useEffect(() => {
    if (!editor) return;

    const editableElement = editor.view.dom;

    const handleTouchStart = (e: TouchEvent) => {
      if (window.innerWidth > 640) return;
      touchTimerRef.current = setTimeout(() => {
        setIsDrawerOpen(true);
      }, 500);
    };

    const handleTouchEnd = () => {
      if (touchTimerRef.current) {
        clearTimeout(touchTimerRef.current);
        touchTimerRef.current = null;
      }
    };

    const handleTouchMove = () => {
      if (touchTimerRef.current) {
        clearTimeout(touchTimerRef.current);
        touchTimerRef.current = null;
      }
    };

    editableElement.addEventListener("touchstart", handleTouchStart);
    editableElement.addEventListener("touchend", handleTouchEnd);
    editableElement.addEventListener("touchmove", handleTouchMove);

    return () => {
      editableElement.removeEventListener("touchstart", handleTouchStart);
      editableElement.removeEventListener("touchend", handleTouchEnd);
      editableElement.removeEventListener("touchmove", handleTouchMove);
    };
  }, [editor]);

  const handleContractChange = (field: string, value: string) => {
    setContract((prev) => ({ ...prev, [field]: value }));
  };

  const handleFieldChange = (index: number, updatedField: Field) => {
    const updatedFields = [...contract.fields];
    updatedFields[index] = updatedField;
    setContract((prev) => ({ ...prev, fields: updatedFields }));
  };

  const addField = () => {
    const newField = {
      name: "",
      type: "text",
      options: [],
      value: "",
      mapping: "",
      required: false,
    };
    setContract((prev) => ({ ...prev, fields: [...prev.fields, newField] }));
    setIsModalOpen(false);
  };

  const addSuggestedField = (field: Field) => {
    setContract((prev) => ({
      ...prev,
      fields: [...prev.fields, { ...field }],
    }));
  };

  const removeField = (index: number) => {
    const updatedFields = [...contract.fields];
    updatedFields.splice(index, 1);
    setContract((prev) => ({ ...prev, fields: updatedFields }));
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

  const createNewSection = () => {
    const newSection = {
      id: `section-${Date.now()}`,
      title: "",
      content: "",
      fields: [],
    };
    setAvailableSections((prev) => [...prev, newSection]);
    setIsModalOpen(false);
  };

  const updateAvailableSection = (
    sectionId: string,
    field: string,
    value: string
  ) => {
    const updatedSections = availableSections.map((section) =>
      section.id === sectionId ? { ...section, [field]: value } : section
    );
    setAvailableSections(updatedSections);
  };

  const addSectionToContent = (section: Section) => {
    if (!section.content.trim()) return;
    const newContent = contract.content
      ? `${contract.content} ${section.content}`
      : section.content;
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
      fields: [...prev.fields, ...newFields],
    }));
    if (editor) {
      editor.commands.insertContent(section.content);
    }
  };

  const updateSection = (sectionId: string, updatedSection: Section) => {
    const updatedSections = contract.sections.map((section) =>
      section.id === sectionId ? updatedSection : section
    );
    setContract((prev) => ({ ...prev, sections: updatedSections }));
  };

  const removeSection = (sectionId: string) => {
    const updatedSections = contract.sections.filter(
      (section) => section.id !== sectionId
    );
    setContract((prev) => ({ ...prev, sections: updatedSections }));
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result;
    if (!destination) return;
    const sections = Array.from(contract.sections);
    const [reorderedSection] = sections.splice(source.index, 1);
    sections.splice(destination.index, 0, reorderedSection);
    setContract((prev) => ({ ...prev, sections }));
  };

  const addParty = () => {
    const newParty: Party = {
      id: `party-${Date.now()}`,
      name: "",
      type: "company",
      fields: [
        {
          name: "CompanyName",
          type: "text",
          value: "",
          required: true,
        },
      ],
    };
    setContract((prev) => ({
      ...prev,
      parties: [...prev.parties, newParty],
    }));
    setIsModalOpen(false);
  };

  const updateParty = (partyId: string, updatedParty: Partial<Party>) => {
    const updatedParties = contract.parties.map((party) =>
      party.id === partyId ? { ...party, ...updatedParty } : party
    );
    setContract((prev) => ({ ...prev, parties: updatedParties }));
  };

  const removeParty = (partyId: string) => {
    const updatedParties = contract.parties.filter(
      (party) => party.id !== partyId
    );
    setContract((prev) => ({ ...prev, parties: updatedParties }));
  };

  const addPartyField = (partyId: string) => {
    const updatedParties = contract.parties.map((party) =>
      party.id === partyId
        ? {
            ...party,
            fields: [
              ...party.fields,
              {
                name: "",
                type: "text",
                value: "",
                required: false,
              },
            ],
          }
        : party
    );
    setContract((prev) => ({ ...prev, parties: updatedParties }));
  };

  const updatePartyField = (
    partyId: string,
    fieldIndex: number,
    updatedField: PartyField
  ) => {
    const updatedParties = contract.parties.map((party) =>
      party.id === partyId
        ? {
            ...party,
            fields: party.fields.map((field, idx) =>
              idx === fieldIndex ? updatedField : field
            ),
          }
        : party
    );
    setContract((prev) => ({ ...prev, parties: updatedParties }));
  };

  const removePartyField = (partyId: string, fieldIndex: number) => {
    const updatedParties = contract.parties.map((party) =>
      party.id === partyId
        ? {
            ...party,
            fields: party.fields.filter((_, idx) => idx !== fieldIndex),
          }
        : party
    );
    setContract((prev) => ({ ...prev, valuta: updatedParties }));
  };

  const handlePartyTypeChange = (
    partyId: string,
    type: "company" | "individual"
  ) => {
    const updatedParties = contract.parties.map((party) =>
      party.id === partyId
        ? {
            ...party,
            type,
            fields:
              type === "company"
                ? [
                    {
                      name: "CompanyName",
                      type: "text",
                      value: "",
                      required: true,
                    },
                  ]
                : [
                    {
                      name: "FirstName",
                      type: "text",
                      value: "",
                      required: true,
                    },
                    {
                      name: "LastName",
                      type: "text",
                      value: "",
                      required: true,
                    },
                  ],
          }
        : party
    );
    setContract((prev) => ({ ...prev, parties: updatedParties }));
  };

  const saveContract = async () => {
    try {
      console.log("Saving contract:", contract);
      alert("Contract saved successfully!");
    } catch (error) {
      console.error("Error saving contract:", error);
      alert("Failed to save contract");
    }
  };

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

  const replacePlaceholders = (content: string) => {
    return content.replace(/§\{([^}]+)\}/g, (match, fieldName) => {
      const field = contract.fields.find((f) => f.name === fieldName);
      return field && field.value ? field.value : fieldName;
    });
  };

  const toggleBold = () => {
    if (editor) {
      editor.chain().focus().toggleBold().run();
    }
  };

  const toggleItalic = () => {
    if (editor) {
      editor.chain().focus().toggleItalic().run();
    }
  };

  const toggleBulletList = () => {
    if (editor) {
      editor.chain().focus().toggleBulletList().run();
    }
  };

  const toggleOrderedList = () => {
    if (editor) {
      editor.chain().focus().toggleOrderedList().run();
    }
  };

  const toggleBlockquote = () => {
    if (editor) {
      editor.chain().focus().toggleBlockquote().run();
    }
  };

  const setHeading = (level: number) => {
    if (editor) {
      editor
        .chain()
        .focus()
        .setHeading({ level: level as 1 | 2 | 3 })
        .run();
    }
  };

  const setFontFamily = (font: string) => {
    if (editor) {
      editor.chain().focus().setFontFamily(font).run();
    }
  };

  const setTextColor = (color: string) => {
    if (editor) {
      editor.chain().focus().setColor(color).run();
    }
  };

  const setTextAlign = (align: "center" | "justify") => {
    if (editor) {
      editor.chain().focus().setTextAlign(align).run();
    }
  };

  const openModalWithTab = (tab: string) => {
    setActiveTab(tab);
    setIsModalOpen(true);
    setIsDrawerOpen(false);
  };

  const handleModalClose = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) {
      setActiveTab("details");
    }
  };

  return (
    <div className="flex h-full relative flex-col sm:flex-row">
      <div className="flex-grow p-6 sm:mr-[320px]">
        <div className="mb-6 flex flex-col space-y-4">
          <h1 className="text-2xl font-bold">
            {mode === "contract" ? "Contract Editor" : "Template Editor"}
          </h1>
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setActiveTab("details")}
                className={
                  activeTab === "details"
                    ? "bg-primary text-primary-foreground"
                    : ""
                }
              >
                Details
              </Button>
              <Button
                variant="outline"
                onClick={() => setActiveTab("preview")}
                className={
                  activeTab === "preview"
                    ? "bg-primary text-primary-foreground"
                    : ""
                }
              >
                Preview
              </Button>
            </div>
            <Button onClick={saveContract} className="hidden sm:block">
              Save {mode === "contract" ? "Contract" : "Template"}
            </Button>
          </div>
        </div>

        {activeTab === "details" && (
          <Card>
            <CardHeader></CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={contract.title}
                    onChange={(e) =>
                      handleContractChange("title", e.target.value)
                    }
                    placeholder={`Enter ${mode} title`}
                  />
                </div>
                <div>
                  <div className="mb-2 flex gap-1 flex-wrap">
                    <Button
                      variant={editor?.isActive("bold") ? "default" : "outline"}
                      size="sm"
                      onClick={toggleBold}
                      title="Bold"
                    >
                      <Bold className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={
                        editor?.isActive("italic") ? "default" : "outline"
                      }
                      size="sm"
                      onClick={toggleItalic}
                      title="Italic"
                    >
                      <Italic className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={
                        editor?.isActive("bulletList") ? "default" : "outline"
                      }
                      size="sm"
                      onClick={toggleBulletList}
                      title="Bullet List"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={
                        editor?.isActive("orderedList") ? "default" : "outline"
                      }
                      size="sm"
                      onClick={toggleOrderedList}
                      title="Ordered List"
                    >
                      <ListOrdered className="h-4 w-4" />
                    </Button>

                    <Button
                      variant={
                        editor?.isActive("blockquote") ? "default" : "outline"
                      }
                      size="sm"
                      onClick={toggleBlockquote}
                      title="Blockquote"
                    >
                      <Quote className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={
                        editor?.isActive("heading", { level: 1 })
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() => setHeading(1)}
                      title="Heading 1"
                    >
                      <Heading1 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={
                        editor?.isActive("heading", { level: 2 })
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() => setHeading(2)}
                      title="Heading 2"
                    >
                      <Heading2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={
                        editor?.isActive("heading", { level: 3 })
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() => setHeading(3)}
                      title="Heading 3"
                    >
                      <Heading3 className="h-4 w-4" />
                    </Button>
                    <Select onValueChange={setFontFamily} defaultValue="Inter">
                      <SelectTrigger className="w-[120px] h-8 text-xs">
                        <SelectValue placeholder="Font" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Inter">Inter</SelectItem>
                        <SelectItem value="Arial">Arial</SelectItem>
                        <SelectItem value="Times New Roman">
                          Times New Roman
                        </SelectItem>
                        <SelectItem value="Georgia">Georgia</SelectItem>
                        <SelectItem value="Courier New">Courier New</SelectItem>
                      </SelectContent>
                    </Select>
                    <input
                      type="color"
                      onChange={(e) => setTextColor(e.target.value)}
                      value="#000000"
                      className={styles.colorPicker}
                      title="Select Color"
                    />
                    <Button
                      variant={
                        editor?.isActive({ textAlign: "center" })
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() => setTextAlign("center")}
                      title="Align Center"
                    >
                      <AlignCenter className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={
                        editor?.isActive({ textAlign: "justify" })
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() => setTextAlign("justify")}
                      title="Justify"
                    >
                      <AlignJustify className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="border rounded-md p-2">
                    <EditorContent
                      editor={editor}
                      className="prose max-w-none"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Use <code>§&#123;fieldName&#125;</code> for dynamic content
                    that will be filled from field values.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "preview" && (
          <Card>
            <CardHeader>
              <CardTitle>
                {/* {mode === "contract" ? "Contract Preview" : "Template Preview"} */}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                {/* <h1 className="text-2xl font-bold mb-4">{contract.title}</h1>
                {contract.description && (
                  <p className="italic text-gray-600 mb-6">
                    {contract.description}
                  </p>
                )} */}
                {contract.content && (
                  <div
                    className="mb-6 whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{
                      __html: replacePlaceholders(contract.content),
                    }}
                  />
                )}
                {contract.sections.map((section) => (
                  <div key={section.id}>
                    <h2 className="text-xl font-semibold mb-2">
                      {section.title}
                    </h2>
                    <div
                      className="whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{
                        __html: replacePlaceholders(section.content),
                      }}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="hidden sm:block fixed top-0 right-0 w-80 h-full border-l bg-gray-50 p-4 min-w-[300px] overflow-y-auto">
        <Tabs defaultValue="sections" className="w-full">
          <TabsList className="grid w-full grid-cols-3 gap-2">
            <TabsTrigger value="sections">Sections</TabsTrigger>
            <TabsTrigger value="fields">Fields</TabsTrigger>
            <TabsTrigger value="parties">Parties</TabsTrigger>
          </TabsList>
          <TabsContent value="sections">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Available Sections</h2>
              <Button onClick={createNewSection} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" /> New Section
              </Button>
            </div>
            <ScrollArea className="h-[calc(100vh-160px)]">
              <div className="space-y-3">
                {availableSections.map((section) => (
                  <Card key={section.id} className="hover:bg-gray-100">
                    <CardContent className="p-3">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Input
                            value={section.title}
                            onChange={(e) =>
                              updateAvailableSection(
                                section.id,
                                "title",
                                e.target.value
                              )
                            }
                            placeholder="Section title"
                            className="flex-grow"
                          />
                        </div>
                        <div className="flex items-start space-x-2">
                          <Textarea
                            value={section.content}
                            onChange={(e) =>
                              updateAvailableSection(
                                section.id,
                                "content",
                                e.target.value
                              )
                            }
                            placeholder="Section content with §{placeholders}"
                            rows={3}
                            className="flex-grow"
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => addSectionToContent(section)}
                            disabled={!section.content.trim()}
                            title="Add section content to contract"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
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
              <Button onClick={addField} size="sm" variant="outline">
                <Plus className="h-4 w-4" /> Add Field
              </Button>
            </div>
            <ScrollArea className="h-[calc(100vh-160px)]">
              <div className="space-y-3">
                {contract.fields.map((field, index) => (
                  <FieldEditor
                    key={field.name || index}
                    field={field}
                    index={index}
                    onChange={(updatedField: Field) =>
                      handleFieldChange(index, updatedField)
                    }
                    onRemove={() => removeField(index)}
                    content={contract.content}
                    onContentChange={handleContractChange.bind(null, "content")}
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
                          onClick={() => addSuggestedField(field)}
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
              <Button onClick={addParty} size="sm" variant="outline">
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
                            updateParty(party.id, { name: e.target.value })
                          }
                          placeholder="Party name (e.g., company1)"
                          className="flex-grow"
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeParty(party.id)}
                          title="Remove party"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <Select
                        value={party.type}
                        onValueChange={(value: "company" | "individual") =>
                          handlePartyTypeChange(party.id, value)
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
                                updatePartyField(party.id, index, {
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
                                updatePartyField(party.id, index, {
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
                                  removePartyField(party.id, index)
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
                          onClick={() => addPartyField(party.id)}
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

      {activeTab === "details" && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-50 border-t p-2 grid grid-cols-3 gap-2 sm:hidden z-50">
          <Button
            variant={activeTab === "sections" ? "default" : "outline"}
            onClick={() => openModalWithTab("sections")}
            aria-label="View Sections"
          >
            Sections
          </Button>
          <Button
            variant={activeTab === "fields" ? "default" : "outline"}
            onClick={() => openModalWithTab("fields")}
            aria-label="View Fields"
          >
            Fields
          </Button>
          <Button
            variant={activeTab === "parties" ? "default" : "outline"}
            onClick={() => openModalWithTab("parties")}
            aria-label="View Parties"
          >
            Parties
          </Button>
        </div>
      )}

      <Dialog open={isModalOpen} onOpenChange={handleModalClose}>
        <DialogContent className="sm:max-w-[425px] max-h-[80vh] p-0">
          <DialogHeader className="p-4 pb-0">
            <div className="flex justify-between items-center">
              <DialogTitle>
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleModalClose(false)}
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          <div className="p-4">
            <Tabs value={activeTab} className="w-full">
              <TabsContent value="sections">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold">Available Sections</h2>
                  <Button
                    onClick={createNewSection}
                    size="sm"
                    variant="outline"
                  >
                    <Plus className="h-4 w-4 mr-1" /> New Section
                  </Button>
                </div>
                <ScrollArea className="h-[calc(80vh-160px)]">
                  <div className="space-y-3">
                    {availableSections.map((section) => (
                      <Card key={section.id} className="hover:bg-gray-100">
                        <CardContent className="p-3">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Input
                                value={section.title}
                                onChange={(e) =>
                                  updateAvailableSection(
                                    section.id,
                                    "title",
                                    e.target.value
                                  )
                                }
                                placeholder="Section title"
                                className="flex-grow"
                              />
                            </div>
                            <div className="flex items-start space-x-2">
                              <Textarea
                                value={section.content}
                                onChange={(e) =>
                                  updateAvailableSection(
                                    section.id,
                                    "content",
                                    e.target.value
                                  )
                                }
                                placeholder="Section content with §{placeholders}"
                                rows={3}
                                className="flex-grow"
                              />
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => addSectionToContent(section)}
                                disabled={!section.content.trim()}
                                title="Add section content to contract"
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
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
                  <Button onClick={addField} size="sm" variant="outline">
                    <Plus className="h-4 w-4" /> Add Field
                  </Button>
                </div>
                <ScrollArea className="h-[calc(80vh-160px)]">
                  <div className="space-y-3">
                    {contract.fields.map((field, index) => (
                      <FieldEditor
                        key={field.name || index}
                        field={field}
                        index={index}
                        onChange={(updatedField: Field) =>
                          handleFieldChange(index, updatedField)
                        }
                        onRemove={() => removeField(index)}
                        content={contract.content}
                        onContentChange={handleContractChange.bind(
                          null,
                          "content"
                        )}
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
                              onClick={() => addSuggestedField(field)}
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
                  <Button onClick={addParty} size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-2" /> Add Party
                  </Button>
                </div>
                <ScrollArea className="h-[calc(80vh-160px)]">
                  <div className="space-y-3">
                    {contract.parties.map((party) => (
                      <Card key={party.id} className="p-3">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Input
                              value={party.name}
                              onChange={(e) =>
                                updateParty(party.id, { name: e.target.value })
                              }
                              placeholder="Party name (e.g., company1)"
                              className="flex-grow"
                            />
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeParty(party.id)}
                              title="Remove party"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <Select
                            value={party.type}
                            onValueChange={(value: "company" | "individual") =>
                              handlePartyTypeChange(party.id, value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="company">Company</SelectItem>
                              <SelectItem value="individual">
                                Individual
                              </SelectItem>
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
                                    updatePartyField(party.id, index, {
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
                                    updatePartyField(party.id, index, {
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
                                      removePartyField(party.id, index)
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
                              onClick={() => addPartyField(party.id)}
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
        </DialogContent>
      </Dialog>

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
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
              onClick={() => openModalWithTab("sections")}
            >
              Sections
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => openModalWithTab("fields")}
            >
              Fields
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => openModalWithTab("parties")}
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

      <Button
        onClick={saveContract}
        className={`block sm:hidden fixed right-6 rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:shadow-xl bg-primary text-primary-foreground z-50 ${
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
