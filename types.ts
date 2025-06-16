export interface Field {
  name: string;
  type: string;
  options: string[];
  value: string;
  mapping: string;
}

export interface Section {
  id: string;
  title: string;
  content: string;
  fields: Field[];
}

export interface PartyField {
  name: string;
  type: string;
  value: string;
}

export interface Party {
  id: string;
  name: string;
  type: "company" | "individual";
  fields: PartyField[];
}

export interface Contract {
  title: string;
  description: string;
  content: string;
  fields: Field[];
  sections: Section[];
  parties: Party[];
}
