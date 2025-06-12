const dummyContractData = {
  title: "Consulting Services Agreement",
  description:
    "This agreement outlines the terms for consulting services provided by the Consultant to the Client.",
  content: `
    <h1 style="text-align: center">Consulting Services Agreement</h1>
    <p>This Consulting Services Agreement ("Agreement") is entered into as of §{effectiveDate} by and between §{party1}, a §{party1Type} ("Client"), and §{party2}, a §{party2Type} ("Consultant").</p>

    <h2>1. Scope of Services</h2>
    <p>The Consultant shall provide the following services to the Client:</p>
    <ul>
      <li>Strategic business consulting in the areas of §{consultingAreas}</li>
      <li>Market analysis and competitive research for §{industry}</li>
      <li>Development of a comprehensive §{planType} plan</li>
      <li>Weekly progress reports to be delivered via §{reportDeliveryMethod}</li>
    </ul>
    <p>The services shall commence on §{startDate} and continue for a period of §{duration} months unless terminated earlier in accordance with this Agreement.</p>

    <h2>2. Compensation</h2>
    <p>The Client shall pay the Consultant a total fee of §{amount} for the services, payable in §{paymentTerms}. The first payment is due on §{firstPaymentDate}, with subsequent payments due on the §{paymentSchedule} of each month thereafter.</p>
    <p>Any additional expenses incurred by the Consultant, such as travel or materials, up to a maximum of §{expenseCap}, shall be reimbursed by the Client within §{reimbursementPeriod} days of receiving an invoice.</p>

    <h2>3. Confidentiality</h2>
    <p>The Consultant agrees to maintain the confidentiality of all proprietary information provided by the Client, including but not limited to §{confidentialItems}. This obligation shall survive the termination of this Agreement for a period of §{confidentialityPeriod} years.</p>

    <h2>4. Termination</h2>
    <p>Either party may terminate this Agreement with §{noticePeriod} days' written notice. Upon termination, the Client shall pay the Consultant for all services rendered up to the date of termination, not to exceed §{terminationCap}.</p>

    <h2>5. Governing Law</h2>
    <p>This Agreement shall be governed by and construed in accordance with the laws of the State of §{governingState}.</p>

    <h2>6. Dispute Resolution</h2>
    <p>Any disputes arising under this Agreement shall be resolved through §{disputeResolutionMethod}, with proceedings to be held in §{disputeLocation}.</p>

    <p><strong>IN WITNESS WHEREOF</strong>, the parties hereto have executed this Agreement as of the day and year first above written.</p>
    <p>Client: §{party1Signature}</p>
    <p>Consultant: §{party2Signature}</p>
  `,
  fields: [
    {
      name: "effectiveDate",
      type: "date",
      options: [],
      value: "2025-06-15",
      mapping: "",
      required: true,
    },
    {
      name: "party1",
      type: "text",
      options: [],
      value: "Acme Corporation",
      mapping: "client.name",
      required: true,
    },
    {
      name: "party1Type",
      type: "text",
      options: [],
      value: "corporation",
      mapping: "",
      required: true,
    },
    {
      name: "party2",
      type: "text",
      options: [],
      value: "Jane Doe Consulting",
      mapping: "consultant.name",
      required: true,
    },
    {
      name: "party2Type",
      type: "text",
      options: [],
      value: "sole proprietorship",
      mapping: "",
      required: true,
    },
    {
      name: "consultingAreas",
      type: "text",
      options: [],
      value: "marketing and operations",
      mapping: "",
      required: false,
    },
    {
      name: "industry",
      type: "text",
      options: [],
      value: "technology",
      mapping: "",
      required: false,
    },
    {
      name: "planType",
      type: "text",
      options: [],
      value: "strategic business",
      mapping: "",
      required: false,
    },
    {
      name: "reportDeliveryMethod",
      type: "text",
      options: ["email", "cloud share", "in-person"],
      value: "email",
      mapping: "",
      required: true,
    },
    {
      name: "startDate",
      type: "date",
      options: [],
      value: "2025-07-01",
      mapping: "",
      required: true,
    },
    {
      name: "duration",
      type: "number",
      options: [],
      value: "12",
      mapping: "",
      required: true,
    },
    {
      name: "amount",
      type: "number",
      options: [],
      value: "50000",
      mapping: "",
      required: true,
    },
    {
      name: "paymentTerms",
      type: "text",
      options: ["monthly", "quarterly", "upon completion"],
      value: "monthly",
      mapping: "",
      required: true,
    },
    {
      name: "firstPaymentDate",
      type: "date",
      options: [],
      value: "2025-07-15",
      mapping: "",
      required: true,
    },
    {
      name: "paymentSchedule",
      type: "text",
      options: [],
      value: "15th",
      mapping: "",
      required: true,
    },
    {
      name: "expenseCap",
      type: "number",
      options: [],
      value: "5000",
      mapping: "",
      required: false,
    },
    {
      name: "reimbursementPeriod",
      type: "number",
      options: [],
      value: "30",
      mapping: "",
      required: false,
    },
    {
      name: "confidentialItems",
      type: "text",
      options: [],
      value: "business plans, financial data, customer lists",
      mapping: "",
      required: false,
    },
    {
      name: "confidentialityPeriod",
      type: "number",
      options: [],
      value: "3",
      mapping: "",
      required: true,
    },
    {
      name: "noticePeriod",
      type: "number",
      options: [],
      value: "30",
      mapping: "",
      required: true,
    },
    {
      name: "terminationCap",
      type: "number",
      options: [],
      value: "10000",
      mapping: "",
      required: false,
    },
    {
      name: "governingState",
      type: "text",
      options: [],
      value: "California",
      mapping: "",
      required: true,
    },
    {
      name: "disputeResolutionMethod",
      type: "text",
      options: ["arbitration", "mediation", "litigation"],
      value: "arbitration",
      mapping: "",
      required: true,
    },
    {
      name: "disputeLocation",
      type: "text",
      options: [],
      value: "San Francisco, California",
      mapping: "",
      required: true,
    },
    {
      name: "party1Signature",
      type: "text",
      options: [],
      value: "John Smith, CEO",
      mapping: "",
      required: true,
    },
    {
      name: "party2Signature",
      type: "text",
      options: [],
      value: "Jane Doe, Consultant",
      mapping: "",
      required: true,
    },
  ],
  sections: [
    {
      id: "section-1",
      title: "Introduction",
      content: `
        <p>This Consulting Services Agreement is made effective as of §{effectiveDate} by and between §{party1}, a §{party1Type}, and §{party2}, a §{party2Type}.</p>
      `,
      fields: [
        {
          name: "effectiveDate",
          type: "date",
          options: [],
          value: "2025-06-15",
          mapping: "",
          required: true,
        },
        {
          name: "party1",
          type: "text",
          options: [],
          value: "Acme Corporation",
          mapping: "client.name",
          required: true,
        },
        {
          name: "party1Type",
          type: "text",
          options: [],
          value: "corporation",
          mapping: "",
          required: true,
        },
        {
          name: "party2",
          type: "text",
          options: [],
          value: "Jane Doe Consulting",
          mapping: "consultant.name",
          required: true,
        },
        {
          name: "party2Type",
          type: "text",
          options: [],
          value: "sole proprietorship",
          mapping: "",
          required: true,
        },
      ],
    },
    {
      id: "section-2",
      title: "Scope of Services",
      content: `
        <p>The Consultant shall provide the following services:</p>
        <ul>
          <li>Strategic consulting in §{consultingAreas}</li>
          <li>Market analysis for §{industry}</li>
          <li>Development of a §{planType} plan</li>
          <li>Weekly reports via §{reportDeliveryMethod}</li>
        </ul>
        <p>Services commence on §{startDate} for §{duration} months.</p>
      `,
      fields: [
        {
          name: "consultingAreas",
          type: "text",
          options: [],
          value: "marketing and operations",
          mapping: "",
          required: false,
        },
        {
          name: "industry",
          type: "text",
          options: [],
          value: "technology",
          mapping: "",
          required: false,
        },
        {
          name: "planType",
          type: "text",
          options: [],
          value: "strategic business",
          mapping: "",
          required: false,
        },
        {
          name: "reportDeliveryMethod",
          type: "text",
          options: ["email", "cloud share", "in-person"],
          value: "email",
          mapping: "",
          required: true,
        },
        {
          name: "startDate",
          type: "date",
          options: [],
          value: "2025-07-01",
          mapping: "",
          required: true,
        },
        {
          name: "duration",
          type: "number",
          options: [],
          value: "12",
          mapping: "",
          required: true,
        },
      ],
    },
    {
      id: "section-3",
      title: "Compensation",
      content: `
        <p>The Client shall pay the Consultant §{amount} in §{paymentTerms} installments, starting on §{firstPaymentDate}, with subsequent payments on the §{paymentSchedule} of each month.</p>
        <p>Reimbursable expenses up to §{expenseCap} shall be paid within §{reimbursementPeriod} days.</p>
      `,
      fields: [
        {
          name: "amount",
          type: "number",
          options: [],
          value: "50000",
          mapping: "",
          required: true,
        },
        {
          name: "paymentTerms",
          type: "text",
          options: ["monthly", "quarterly", "upon completion"],
          value: "monthly",
          mapping: "",
          required: true,
        },
        {
          name: "firstPaymentDate",
          type: "date",
          options: [],
          value: "2025-07-15",
          mapping: "",
          required: true,
        },
        {
          name: "paymentSchedule",
          type: "text",
          options: [],
          value: "15th",
          mapping: "",
          required: true,
        },
        {
          name: "expenseCap",
          type: "number",
          options: [],
          value: "5000",
          mapping: "",
          required: false,
        },
        {
          name: "reimbursementPeriod",
          type: "number",
          options: [],
          value: "30",
          mapping: "",
          required: false,
        },
      ],
    },
  ],
  parties: [
    {
      id: "party-1",
      name: "Acme Corporation",
      type: "company",
      fields: [
        {
          name: "CompanyName",
          type: "text",
          value: "Acme Corporation",
          required: true,
        },
        {
          name: "Address",
          type: "text",
          value: "123 Business Rd, San Francisco, CA 94105",
          required: false,
        },
        {
          name: "ContactEmail",
          type: "email",
          value: "contact@acme.com",
          required: true,
        },
      ],
    },
    {
      id: "party-2",
      name: "Jane Doe",
      type: "individual",
      fields: [
        {
          name: "FirstName",
          type: "text",
          value: "Jane",
          required: true,
        },
        {
          name: "LastName",
          type: "text",
          value: "Doe",
          required: true,
        },
        {
          name: "Email",
          type: "email",
          value: "jane.doe@consulting.com",
          required: true,
        },
      ],
    },
  ],
};

export default dummyContractData;
