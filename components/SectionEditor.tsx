import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import FieldEditor from "@/components/FieldEditor";

type Field = {
  name: string;
  type: string;
  options: string[];
  value: string;
  mapping: string;
  required: boolean;
};

type Section = {
  title: string;
  content: string;
  fields: Field[];
};

interface SectionEditorProps {
  section: Section;
  onChange: (section: Section) => void;
}

const SectionEditor = ({ section, onChange }: SectionEditorProps) => {
  const [localSection, setLocalSection] = useState(section);

  const handleChange = (field: string, value: string) => {
    const updatedSection = { ...localSection, [field]: value };
    setLocalSection(updatedSection);
    onChange(updatedSection);
  };

  const handleFieldChange = (index: number, updatedField: Field) => {
    const updatedFields = [...localSection.fields];
    updatedFields[index] = updatedField;
    const updatedSection = { ...localSection, fields: updatedFields };
    setLocalSection(updatedSection);
    onChange(updatedSection);
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
    const updatedFields = [...localSection.fields, newField];
    const updatedSection = { ...localSection, fields: updatedFields };
    setLocalSection(updatedSection);
    onChange(updatedSection);
  };

  const removeField = (index: number) => {
    const updatedFields = [...localSection.fields];
    updatedFields.splice(index, 1);
    const updatedSection = { ...localSection, fields: updatedFields };
    setLocalSection(updatedSection);
    onChange(updatedSection);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="section-title">Title</Label>
        <Input
          id="section-title"
          value={localSection.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="Section title"
        />
      </div>

      <div>
        <Label htmlFor="section-content">Content</Label>
        <Textarea
          id="section-content"
          value={localSection.content}
          onChange={(e) => handleChange("content", e.target.value)}
          placeholder="Enter section content with §{placeholders}"
          rows={6}
        />
        <p className="text-sm text-gray-500 mt-1">
          Use <code>§&#123;placeholder&#125;</code> for dynamic content that
          will be filled from field values.
        </p>
      </div>

      <div className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Section Fields</h3>
          <Button onClick={addField} size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-1" /> Add Field
          </Button>
        </div>

        {localSection.fields.map((field, index) => (
          <FieldEditor
            key={index}
            field={field}
            index={index}
            onChange={(updatedField: any) =>
              handleFieldChange(index, updatedField)
            }
            onRemove={() => removeField(index)}
            content={localSection.content}
            onContentChange={handleChange.bind(null, "content")}
            editor={null}
          />
        ))}
      </div>
    </div>
  );
};

export default SectionEditor;
