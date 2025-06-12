import { Card, CardContent } from "@/components/ui/card";
import { Contract } from "@/types";

type ContractPreviewProps = {
  contract: Contract;
  mode: "contract" | "template";
};

const ContractPreview = ({ contract, mode }: ContractPreviewProps) => {
  const replacePlaceholders = (content: string) => {
    return content.replace(/§\{([^}]+)\}/g, (match, fieldName) => {
      const field = contract.fields.find((f) => f.name === fieldName);
      return field && field.value ? field.value : fieldName;
    });
  };
  // this is just to make the mode value used once in order to be able to deploy to Vercel :p
  console.log(mode);
  return (
    <Card>
      {/* <CardHeader>
        <CardTitle>
          {mode === "contract" ? "Contract Preview" : "Template Preview"}
        </CardTitle>
      </CardHeader> */}
      <CardContent>
        <div className="prose max-w-none mt-3">
          {contract.content ? (
            <div
              className="prose max-w-none leading-normal mb-2"
              dangerouslySetInnerHTML={{
                __html: replacePlaceholders(contract.content),
              }}
            />
          ) : (
            <p>No content available.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ContractPreview;
