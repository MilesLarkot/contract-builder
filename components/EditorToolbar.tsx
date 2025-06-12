import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
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
} from "lucide-react";
import { Editor } from "@tiptap/react";
import styles from "./ContractEditor.module.css";

type EditorToolbarProps = {
  editor: Editor | null;
};

const EditorToolbar = ({ editor }: EditorToolbarProps) => {
  if (!editor) return null;

  const toggleBold = () => editor.chain().focus().toggleBold().run();
  const toggleItalic = () => editor.chain().focus().toggleItalic().run();
  const toggleBulletList = () =>
    editor.chain().focus().toggleBulletList().run();
  const toggleOrderedList = () =>
    editor.chain().focus().toggleOrderedList().run();
  const toggleBlockquote = () =>
    editor.chain().focus().toggleBlockquote().run();
  const setHeading = (level: number) =>
    editor
      .chain()
      .focus()
      .setHeading({ level: level as 1 | 2 | 3 })
      .run();
  const setFontFamily = (font: string) =>
    editor.chain().focus().setFontFamily(font).run();
  const setTextColor = (color: string) =>
    editor.chain().focus().setColor(color).run();
  const setTextAlign = (align: "center" | "justify") =>
    editor.chain().focus().setTextAlign(align).run();

  return (
    <div className="mb-2 flex gap-1 flex-wrap">
      <Button
        variant={editor.isActive("bold") ? "default" : "outline"}
        size="sm"
        onClick={toggleBold}
        title="Bold"
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        variant={editor.isActive("italic") ? "default" : "outline"}
        size="sm"
        onClick={toggleItalic}
        title="Italic"
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        variant={editor.isActive("bulletList") ? "default" : "outline"}
        size="sm"
        onClick={toggleBulletList}
        title="Bullet List"
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        variant={editor.isActive("orderedList") ? "default" : "outline"}
        size="sm"
        onClick={toggleOrderedList}
        title="Ordered List"
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
      <Button
        variant={editor.isActive("blockquote") ? "default" : "outline"}
        size="sm"
        onClick={toggleBlockquote}
        title="Blockquote"
      >
        <Quote className="h-4 w-4" />
      </Button>
      <Button
        variant={
          editor.isActive("heading", { level: 1 }) ? "default" : "outline"
        }
        size="sm"
        onClick={() => setHeading(1)}
        title="Heading 1"
      >
        <Heading1 className="h-4 w-4" />
      </Button>
      <Button
        variant={
          editor.isActive("heading", { level: 2 }) ? "default" : "outline"
        }
        size="sm"
        onClick={() => setHeading(2)}
        title="Heading 2"
      >
        <Heading2 className="h-4 w-4" />
      </Button>
      <Button
        variant={
          editor.isActive("heading", { level: 3 }) ? "default" : "outline"
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
          <SelectItem value="Times New Roman">Times New Roman</SelectItem>
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
          editor.isActive({ textAlign: "center" }) ? "default" : "outline"
        }
        size="sm"
        onClick={() => setTextAlign("center")}
        title="Align Center"
      >
        <AlignCenter className="h-4 w-4" />
      </Button>
      <Button
        variant={
          editor.isActive({ textAlign: "justify" }) ? "default" : "outline"
        }
        size="sm"
        onClick={() => setTextAlign("justify")}
        title="Justify"
      >
        <AlignJustify className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default EditorToolbar;
