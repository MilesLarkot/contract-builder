import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Trash2, X, Plus, Type } from "lucide-react";
import { Editor } from "@tiptap/react";

type Field = {
  name: string;
  type: string;
  options: string[];
  value: string;
  mapping: string;
  required: boolean;
};

type FieldEditorProps = {
  field: Field;
  index: number;
  onChange: (field: Field) => void;
  onRemove: () => void;
  content: string;
  onContentChange: (content: string) => void;
  editor: Editor | null;
  mode: "contract" | "template";
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
}: FieldEditorProps) => {
  const [optionInput, setOptionInput] = useState("");
  const [localName, setLocalName] = useState(field.name);

  // Log content and field state for debugging
  useEffect(() => {
    console.log(`FieldEditor for ${field.name}:`, {
      content,
      isInContent: isFieldInContent,
      hasValue: !!field.value,
    });
  }, [content, field.name, field.value]);

  const handleFieldChange = (
    key: keyof Field,
    value: string | string[] | boolean
  ) => {
    const updatedField = { ...field, [key]: value };
    onChange(updatedField);
  };

  const addOption = () => {
    if (optionInput.trim() === "") return;
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
      const placeholder = `<span>${localName}</span>`;
      const newContent = content ? `${content} ${placeholder}` : placeholder;
      onContentChange(newContent);
    }
    handleFieldChange("name", localName);
  };

  // Check for placeholder in editor's format
  const isFieldInContent =
    field.name && content?.includes(`data-placeholder="${field.name}"`);
  const hasValue = !!field.value;

  const getCircleStyles = () => {
    if (isFieldInContent && hasValue) {
      return "bg-cyan-500";
    } else if (isFieldInContent && !hasValue) {
      return "border-2 border-cyan-500";
    } else if (!isFieldInContent && hasValue) {
      return "bg-gray-300";
    } else {
      return "border-2 border-gray-300"; // Gray border when not in content and no value
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

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalName(e.target.value);
  };

  const handleNameBlur = () => {
    handleFieldChange("name", localName);
  };

  return (
    <div className="flex items-center space-x-2 p-2 border rounded-md">
      <div className={`w-3 h-3 rounded-full mr-2 ${getCircleStyles()}`} />
      <Input
        value={localName}
        onChange={handleNameChange}
        onBlur={handleNameBlur}
        placeholder="Field name"
        className="flex-grow"
      />
      <Button
        variant="ghost"
        size="icon"
        onClick={addFieldToContent}
        disabled={!localName.trim()}
        title="Add field to content"
      >
        <Plus className="h-4 w-4" />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreVertical className="h-5 w-5 text-gray-500" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64">
          <DropdownMenuLabel>Field Settings</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="p-2 space-y-3">
            <div>
              <Label htmlFor={`field-value-${index}`}>Value</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id={`field-value-${index}`}
                  type={getInputType(field.type)}
                  value={field.value}
                  onChange={(e) => handleFieldChange("value", e.target.value)}
                  placeholder="Field value"
                  disabled={mode === "template"}
                  className="flex-grow"
                />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Change field type"
                    >
                      <Type className="h-4 w-4" />
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
            <div>
              <Label htmlFor={`field-mapping-${index}`}>Mapping</Label>
              <Input
                id={`field-mapping-${index}`}
                value={field.mapping}
                onChange={(e) => handleFieldChange("mapping", e.target.value)}
                placeholder="e.g. collaborator.name"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id={`field-required-${index}`}
                checked={field.required}
                onCheckedChange={(checked) =>
                  handleFieldChange("required", checked)
                }
              />
              <Label htmlFor={`field-required-${index}`}>Required</Label>
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
    </div>
  );
};

export default React.memo(FieldEditor);
