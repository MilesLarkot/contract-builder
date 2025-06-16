import { Node, mergeAttributes } from "@tiptap/core";
import type { Field } from "@/types";

interface PlaceholderOptions {
  fields: Field[];
  onEditField?: (fieldName: string, newValue: string) => void;
}

const PlaceholderExtension = Node.create<PlaceholderOptions>({
  name: "placeholder",

  group: "inline",

  inline: true,

  selectable: true,

  atom: true,

  addOptions() {
    return {
      fields: [],
      onEditField: undefined,
    };
  },

  addAttributes() {
    return {
      placeholder: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-placeholder"),
        renderHTML: (attributes) => ({
          "data-placeholder": attributes.placeholder,
        }),
      },
      value: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-value") || null,
        renderHTML: (attributes) => ({
          "data-value": attributes.value || null,
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "span[data-placeholder]",
        getAttrs: (element) => {
          if (typeof element === "string") return false;
          const placeholder = element.getAttribute("data-placeholder");
          if (!placeholder) return false;
          const value = element.getAttribute("data-value") || null;
          return { placeholder, value };
        },
      },
      {
        tag: "span",
        getAttrs: (element) => {
          if (typeof element === "string") return false;
          const text = element.textContent || "";
          return { placeholder: text, value: null };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const placeholder = HTMLAttributes["data-placeholder"];
    if (!placeholder) return ["span", {}, ""];

    const field = this.options.fields.find((f) => f.name === placeholder);
    const displayText = field?.value || placeholder;

    return [
      "span",
      mergeAttributes(HTMLAttributes, {
        class:
          "inline-block bg-blue-100 text-blue-800 rounded px-1.5 py-0.5 text-sm font-medium cursor-pointer hover:bg-blue-200",
        "data-placeholder": placeholder,
        "data-value": field?.value || null,
      }),
      displayText,
    ];
  },

  addNodeView() {
    return ({ node }) => {
      const placeholder = node.attrs.placeholder;
      if (!placeholder) return { dom: document.createElement("span") };

      const field = this.options.fields.find((f) => f.name === placeholder);
      const displayText = field?.value || placeholder;

      const dom = document.createElement("span");
      dom.className =
        "inline-block bg-blue-100 text-blue-800 rounded px-1.5 py-0.5 text-sm font-medium cursor-pointer hover:bg-blue-200";
      dom.setAttribute("data-placeholder", placeholder);
      if (field?.value) {
        dom.setAttribute("data-value", field.value);
      }
      dom.innerText = displayText;

      dom.addEventListener("click", (e) => {
        e.preventDefault();
        if (this.options.onEditField) {
          this.options.onEditField(placeholder, field?.value || "");
        }
      });

      return { dom };
    };
  },
});

export default PlaceholderExtension;
