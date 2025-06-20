import React, { useState, useRef, useCallback, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MoreVertical,
  Trash2,
  X,
  Plus,
  Type,
  Hash,
  Calendar,
  Mail,
} from "lucide-react";
import { Editor } from "@tiptap/react";
import { Contract, Field, Party } from "@/types";

type FieldEditorProps = {
  field: Field;
  index: number;
  onChange: (field: Field) => void;
  onRemove: () => void;
  content: string;
  onContentChange: (content: string) => void;
  editor: Editor | null;
  mode: "contract" | "template";
  parties: Party[];
};

const FieldEditor = ({
  field,
  index,
  onChange,
  onRemove,
  content,
  onContentChange,
  editor,
  mode,
  parties,
}: FieldEditorProps) => {
  const [optionInput, setOptionInput] = useState("");
  const [localName, setLocalName] = useState(field.name);
  const [isEditing, setIsEditing] = useState(!field.name);
  const valueInputRef = useRef<HTMLInputElement>(null);

  // Initialize dropdown states
  const initialMapping = useMemo(() => {
    if (field.mapping) {
      const [partyId, fieldName] = field.mapping.split(".");
      if (partyId && parties.some((party) => party.id === partyId)) {
        return {
          partyId,
          fieldName:
            fieldName &&
            parties
              .find((party) => party.id === partyId)
              ?.fields.some((f) => f.name === fieldName)
              ? fieldName
              : "",
        };
      }
    }
    return { partyId: "", fieldName: "" };
  }, [field.mapping, parties]);

  const [selectedPartyId, setSelectedPartyId] = useState(
    initialMapping.partyId
  );
  const [selectedFieldName, setSelectedFieldName] = useState(
    initialMapping.fieldName
  );

  const isFieldInContent =
    field.name && content?.includes(`data-placeholder="${field.name}"`);

  const showOptions = field.type === "text";

  const handleFieldChange = useCallback(
    (key: keyof Field, value: string | string[]) => {
      const updatedField = { ...field, [key]: value };
      if (key === "type" && value !== "text") {
        updatedField.options = [];
        setOptionInput("");
      }
      onChange(updatedField);
    },
    [field, onChange]
  );

  const addOption = () => {
    if (optionInput.trim() === "" || !showOptions) return;
    const updatedOptions = [...field.options, optionInput.trim()];
    handleFieldChange("options", updatedOptions);
    setOptionInput("");
  };

  const removeOption = (optionIndex: number) => {
    const updatedOptions = field.options.filter((_, i) => i !== optionIndex);
    handleFieldChange("options", updatedOptions);
  };

  const addFieldToContent = () => {
    if (!localName.trim()) return;

    if (editor) {
      editor.commands.insertContent({
        type: "placeholder",
        attrs: { placeholder: localName },
      });
      editor.commands.insertContent(" ");
    } else {
      const placeholder = `<span data-placeholder="${localName}">${localName}</span>`;
      const newContent = content ? `${content} ${placeholder}` : placeholder;
      onContentChange(newContent);
    }
    handleFieldChange("name", localName);
  };

  const hasValue = !!field.value;

  const getCircleStyles = () => {
    if (isFieldInContent && hasValue) {
      return "bg-cyan-500";
    } else if (isFieldInContent && !hasValue) {
      return "border-2 border-cyan-500";
    } else if (!isFieldInContent && hasValue) {
      return "bg-gray-300";
    } else {
      return "border-2 border-gray-300";
    }
  };

  const getInputType = (fieldType: string) => {
    switch (fieldType) {
      case "date":
        return "date";
      case "number":
        return "number";
      case "email":
        return "email";
      default:
        return "text";
    }
  };

  const getTypeIcon = () => {
    switch (field.type) {
      case "number":
        return <Hash className="h-4 w-4" />;
      case "date":
        return <Calendar className="h-4 w-4" />;
      case "email":
        return <Mail className="h-4 w-4" />;
      default:
        return <Type className="h-4 w-4" />;
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalName(e.target.value);
  };

  const handleNameBlur = () => {
    if (localName.trim()) {
      handleFieldChange("name", localName);
      setIsEditing(false);
    }
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (field.type === "number" && value !== "") {
      if (!/^-?\d*\.?\d*$/.test(value)) {
        return;
      }
    }
    handleFieldChange("value", value);
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    if (!localName.trim()) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData("fieldName", localName);
    e.dataTransfer.effectAllowed = "move";
    handleFieldChange("name", localName);
  };

  const handlePartyChange = useCallback(
    (partyId: string) => {
      console.log("Selected party:", partyId, {
        previousPartyId: selectedPartyId,
      });
      setSelectedPartyId(partyId);
      setSelectedFieldName("");
      const newMapping = partyId ? partyId : "";
      console.log("Setting mapping (party change):", newMapping);
      handleFieldChange("mapping", newMapping);
    },
    [handleFieldChange, selectedPartyId]
  );

  const handleFieldNameChange = useCallback(
    (fieldName: string) => {
      console.log("Selected field:", fieldName, {
        currentPartyId: selectedPartyId,
      });
      setSelectedFieldName(fieldName);
      const newMapping =
        selectedPartyId && fieldName
          ? `${selectedPartyId}.${fieldName}`
          : selectedPartyId || "";
      console.log("Setting mapping (field change):", newMapping);
      handleFieldChange("mapping", newMapping);
    },
    [handleFieldChange, selectedPartyId]
  );

  const selectedPartyFields = useMemo(() => {
    return parties.find((party) => party.id === selectedPartyId)?.fields || [];
  }, [parties, selectedPartyId]);

  return (
    <div
      className="flex items-center space-x-2 p-2 border-b rounded-md"
      draggable={!!localName.trim()}
      onDragStart={handleDragStart}
      onDragOver={(e) => e.preventDefault()}
    >
      <div className={`w-3 h-3 rounded-full mr-2 ${getCircleStyles()}`} />

      <div className="flex flex-col flex-grow">
        {isEditing ? (
          <Input
            value={localName}
            onChange={handleNameChange}
            onBlur={handleNameBlur}
            placeholder="Field name"
            className="mb-1"
            autoFocus
          />
        ) : (
          <span
            className="inline-block bg-blue-100 text-blue-800 rounded px-1.5 py-0.5 text-sm font-medium cursor-pointer mb-1"
            onClick={() => setIsEditing(true)}
          >
            {localName || "Unnamed Field"}
          </span>
        )}
        <div className="flex items-center space-x-2">
          <Input
            ref={valueInputRef}
            type={getInputType(field.type)}
            value={field.value}
            onChange={handleValueChange}
            placeholder="Field value"
            disabled={mode === "template"}
            className="text-sm flex-grow"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" title="Change field type">
                {getTypeIcon()}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => handleFieldChange("type", "text")}
              >
                Text
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleFieldChange("type", "number")}
              >
                Number
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleFieldChange("type", "date")}
              >
                Date
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleFieldChange("type", "email")}
              >
                Email
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="flex flex-col space-y-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5 text-gray-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64">
            <DropdownMenuLabel>Field Settings</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="p-2 space-y-3">
              {showOptions && (
                <div>
                  <Label>Options</Label>
                  <div className="flex space-x-2">
                    <Input
                      value={optionInput}
                      onChange={(e) => setOptionInput(e.target.value)}
                      placeholder="Enter option"
                    />
                    <Button size="sm" onClick={addOption}>
                      Add
                    </Button>
                  </div>
                  {field.options.length > 0 && (
                    <div className="mt-2">
                      {field.options.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className="flex items-center justify-between text-sm bg-gray-100 p-1 rounded mb-1"
                        >
                          <span>{option}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeOption(optionIndex)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              <div>
                <Label htmlFor={`field-mapping-${index}`}>Mapping</Label>
                <div className="flex items-center space-x-2">
                  <Select
                    value={selectedPartyId}
                    onValueChange={handlePartyChange}
                    key={`party-select-${index}`}
                  >
                    <SelectTrigger id={`party-select-${index}`}>
                      <SelectValue placeholder="Select party" />
                    </SelectTrigger>
                    <SelectContent>
                      {parties.length === 0 ? (
                        <SelectItem value="no-parties" disabled>
                          No parties available
                        </SelectItem>
                      ) : (
                        parties.map((party) => (
                          <SelectItem key={party.id} value={party.id}>
                            {party.name || `Party ${party.id}`}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <span>.</span>
                  <Select
                    value={selectedFieldName}
                    onValueChange={handleFieldNameChange}
                    disabled={!selectedPartyId}
                    key={`field-select-${index}`}
                  >
                    <SelectTrigger id={`field-select-${index}`}>
                      <SelectValue placeholder="Select field" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedPartyFields.length === 0 ? (
                        <SelectItem value="no-fields" disabled>
                          No fields available
                        </SelectItem>
                      ) : (
                        selectedPartyFields.map((partyField, idx) => (
                          <SelectItem
                            key={`${partyField.name || "field"}-${idx}`}
                            value={partyField.name}
                          >
                            {partyField.name || `Field ${idx + 1}`}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DropdownMenuItem
                onClick={onRemove}
                className="text-red-500 cursor-pointer"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Field
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          variant="ghost"
          size="icon"
          onClick={addFieldToContent}
          disabled={!localName}
          title="Add field to content"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default React.memo(FieldEditor);
