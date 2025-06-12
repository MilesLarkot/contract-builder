// types.ts
export type Field = {
  name: string;
  type: string;
  options: any[];
  value: string;
  mapping: string;
  required: boolean;
};

export type PartyField = {
  name: string;
  type: string;
  value: string;
  required: boolean;
};

export type Party = {
  id: string;
  name: string;
  type: "company" | "individual";
  fields: PartyField[];
};

export type Section = {
  id: string;
  title: string;
  content: string;
  fields: Field[];
};

export type Contract = {
  title: string;
  description: string;
  content: string;
  fields: Field[];
  sections: Section[];
  parties: Party[];
};
