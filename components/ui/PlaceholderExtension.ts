import { Node, mergeAttributes } from "@tiptap/core";

const PlaceholderExtension = Node.create({
  name: "placeholder",

  group: "inline",

  inline: true,

  selectable: true,

  atom: true,

  addAttributes() {
    return {
      placeholder: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-placeholder"),
        renderHTML: (attributes) => ({
          "data-placeholder": attributes.placeholder,
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
          return { placeholder };
        },
      },
      {
        tag: "span",
        getAttrs: (element) => {
          if (typeof element === "string") return false;
          const text = element.textContent || "";
          return { placeholder: text };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const placeholder = HTMLAttributes["data-placeholder"];
    if (!placeholder) return ["span", {}, ""];
    return [
      "span",
      mergeAttributes(HTMLAttributes, {
        class:
          "inline-block bg-blue-100 text-blue-800 rounded px-1.5 py-0.5 text-sm font-medium",
        "data-placeholder": placeholder,
      }),
      placeholder,
    ];
  },

  addNodeView() {
    return ({ node }) => {
      const placeholder = node.attrs.placeholder;
      if (!placeholder) return { dom: document.createElement("span") };
      const dom = document.createElement("span");
      dom.className =
        "inline-block bg-blue-100 text-blue-800 rounded px-1.5 py-0.5 text-sm font-medium";
      dom.setAttribute("data-placeholder", placeholder);
      dom.innerText = placeholder;
      return { dom };
    };
  },
});

export default PlaceholderExtension;
