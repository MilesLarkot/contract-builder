import { useState, useEffect } from "react";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import FontFamily from "@tiptap/extension-font-family";
import TextAlign from "@tiptap/extension-text-align";
import Blockquote from "@tiptap/extension-blockquote";
import type { Contract, Field, Section, Party, PartyField } from "@/types";

type UseContractEditorProps = {
  initialContract: Contract | null;
  mode: "contract" | "template";
};

const useContractEditor = ({
  initialContract,
  mode,
}: UseContractEditorProps) => {
  const [contract, setContract] = useState<Contract>(
    initialContract || {
      title: "",
      description: "",
      content: "",
      fields: [],
      sections: [],
      parties: [],
    }
  );
  const [availableSections, setAvailableSections] = useState<Section[]>([]);
  const [activeTab, setActiveTab] = useState("details");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Heading.configure({ levels: [1, 2, 3] }),
      BulletList,
      OrderedList,
      ListItem,
      TextStyle,
      Color,
      FontFamily.configure({ types: ["textStyle"] }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["center", "justify"],
      }),
      Blockquote,
    ],
    content: contract.content,
    onUpdate: ({ editor }) => {
      setContract((prev) => ({ ...prev, content: editor.getHTML() }));
    },
  });

  useEffect(() => {
    const fetchSections = async () => {
      // Mock fetch as in original
      const mockSections: Section[] = [
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
            },
            {
              name: "party2",
              type: "text",
              options: [],
              value: "",
              mapping: "",
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
            },
          ],
        },
      ];
      setAvailableSections(mockSections);
    };
    fetchSections();
  }, []);

  useEffect(() => {
    if (editor && contract.content !== editor.getHTML()) {
      editor.commands.setContent(contract.content, false);
    }
  }, [contract.content, editor]);

  const handleContractChange = (field: string, value: any) => {
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

  const extractFieldsFromContent = (content: string) => {
    const placeholderRegex = /§\{([^}]+)\}/g;
    const fields: string[] = [];
    let match;
    while ((match = placeholderRegex.exec(content)) !== null) {
      fields.push(match[1]);
    }
    return fields;
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

  const addParty = () => {
    const newParty: Party = {
      id: `party-${Date.now()}`,
      name: "",
      type: "company",
      fields: [{ name: "CompanyName", type: "text", value: "" }],
    };
    setContract((prev) => ({ ...prev, parties: [...prev.parties, newParty] }));
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
              { name: "", type: "text", value: "", required: false },
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
    setContract((prev) => ({ ...prev, parties: updatedParties }));
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
                    },
                  ]
                : [
                    {
                      name: "FirstName",
                      type: "text",
                      value: "",
                    },
                    {
                      name: "LastName",
                      type: "text",
                      value: "",
                    },
                  ],
          }
        : party
    );
    setContract((prev) => ({ ...prev, parties: updatedParties }));
  };

  const saveContract = async () => {
    try {
      alert("Contract saved successfully!");
    } catch (error) {
      console.error("Error saving contract:", error);
      alert("Failed to save contract");
    }
  };

  return {
    contract,
    availableSections,
    activeTab,
    setActiveTab,
    isModalOpen,
    setIsModalOpen,
    isDrawerOpen,
    setIsDrawerOpen,
    editor,
    handleContractChange,
    handleFieldChange,
    addField,
    addSuggestedField,
    removeField,
    createNewSection,
    updateAvailableSection,
    addSectionToContent,
    updateSection,
    removeSection,
    addParty,
    updateParty,
    removeParty,
    addPartyField,
    updatePartyField,
    removePartyField,
    handlePartyTypeChange,
    saveContract,
  };
};

export default useContractEditor;
