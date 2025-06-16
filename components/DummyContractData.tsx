import { Contract } from "@/types";

const DummyContractData: Contract = {
  title: "Sample Service Agreement",
  description:
    "A sample service agreement between a client and a service provider.",
  content: `
    <h1>Service Agreement</h1>
    <p>This Service Agreement ("Agreement") is entered into on <span>effectiveDate</span> between <span>clientName</span> ("Client") and <span>providerName</span> ("Provider").</p>
    <h2>Scope of Services</h2>
    <p>The Provider agrees to perform services as described below for the Client, for a total fee of <span>totalFee</span>.</p>
    <p>Services will commence on <span>startDate</span> and continue until <span>endDate</span> unless terminated earlier in accordance with this Agreement.</p>
    <h2>Payment Terms</h2>
    <p>The Client shall pay the Provider the agreed-upon fee in accordance with the following schedule: 50% upon signing, and 50% upon completion, via <span>paymentMethod</span>.</p>
  `,
  fields: [
    {
      name: "effectiveDate",
      type: "date",
      options: [],
      value: "",
      mapping: "",
    },
    {
      name: "clientName",
      type: "text",
      options: [],
      value: "",
      mapping: "client.name",
    },
    {
      name: "providerName",
      type: "text",
      options: [],
      value: "",
      mapping: "provider.name",
    },
    {
      name: "totalFee",
      type: "number",
      options: [],
      value: "",
      mapping: "",
    },
    {
      name: "startDate",
      type: "date",
      options: [],
      value: "",
      mapping: "",
    },
    {
      name: "endDate",
      type: "date",
      options: [],
      value: "",
      mapping: "",
    },
    {
      name: "paymentMethod",
      type: "text",
      options: ["Bank Transfer", "Credit Card", "PayPal"],
      value: "",
      mapping: "",
    },
  ],
  sections: [
    {
      id: "s1",
      title: "Introduction",
      content:
        "This agreement is made between <span>clientName</span> and <span>providerName</span>.",
      fields: [
        {
          name: "clientName",
          type: "text",
          options: [],
          value: "",
          mapping: "client.name",
        },
        {
          name: "providerName",
          type: "text",
          options: [],
          value: "",
          mapping: "provider.name",
        },
      ],
    },
    {
      id: "s2",
      title: "Term",
      content:
        "The term of this agreement will commence on <span>startDate</span> and end on <span>endDate</span>.",
      fields: [
        {
          name: "startDate",
          type: "date",
          options: [],
          value: "",
          mapping: "",
        },
        {
          name: "endDate",
          type: "date",
          options: [],
          value: "",
          mapping: "",
        },
      ],
    },
  ],
  parties: [
    {
      id: "p1",
      name: "",
      type: "company",
      fields: [
        {
          name: "clientName",
          type: "text",
          value: "",
        },
        {
          name: "clientAddress",
          type: "text",
          value: "",
        },
      ],
    },
    {
      id: "p2",
      name: "",
      type: "company",
      fields: [
        {
          name: "providerName",
          type: "text",
          value: "",
        },
        {
          name: "providerEmail",
          type: "email",
          value: "",
        },
      ],
    },
  ],
};

export default DummyContractData;
