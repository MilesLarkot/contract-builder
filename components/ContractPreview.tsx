import { Card, CardContent } from "@/components/ui/card";
import { Contract } from "@/types";

type ContractPreviewProps = {
  contract: Contract;
  mode: "contract" | "template";
};

export default function ContractPreview({
  contract,
  mode,
}: ContractPreviewProps) {
  const replacePlaceholders = (content: string) => {
    return content.replace(
      /<span data-placeholder="([^"]+)" class="[^"]*">[^<]*<\/span>/g,
      (match, fieldName) => {
        const field = contract.fields.find((f) => f.name === fieldName);
        if (field && field.value) {
          return field.value; // Plain text for fields with values
        }
        return `<span class="inline-block bg-blue-100 text-blue-800 rounded px-1.5 py-0.5 text-sm font-medium" data-placeholder="${fieldName}">${fieldName}</span>`; // Chip for fields without values
      }
    );
  };

  console.log(mode); // For Vercel deployment

  return (
    <Card>
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
}
