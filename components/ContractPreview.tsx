import { Card, CardContent } from "@/components/ui/card";
import { Contract } from "@/types";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

type ContractPreviewProps = {
  contract: Contract;
  mode: "contract" | "template";
};

const ExportToPDF = ({
  contentRef,
  contract,
}: {
  contentRef: React.RefObject<HTMLDivElement>;
  contract: Contract;
}) => {
  const [error, setError] = useState<string | null>(null);

  const handleExportToPDF = async () => {
    setError(null);
    if (!contentRef.current || !contract.content) return;

    const placeholderRegex = /<span\s*data-placeholder="([^"]+)"[^>]*>/g;
    const usedFieldNames = new Set<string>();
    let match;
    while ((match = placeholderRegex.exec(contract.content))) {
      if (match[1]) {
        usedFieldNames.add(match[1]);
      }
    }

    const missingFields = Array.from(usedFieldNames).filter((fieldName) => {
      const field = contract.fields.find((f) => f.name === fieldName);
      return !field || !field.value.trim();
    });

    if (missingFields.length > 0) {
      setError(
        `The following placeholders are missing values: ${missingFields.join(
          ", "
        )}.`
      );
      return;
    }

    try {
      const tempDiv = document.createElement("div");
      tempDiv.className = "prose max-w-none leading-normal";
      tempDiv.style.position = "absolute";
      tempDiv.style.left = "-9999px";
      document.body.appendChild(tempDiv);

      const cleanedContent = contract.content.replace(
        /<span\s*(?:data-placeholder="([^"]+)")?\s*(?:class="[^"]*")?>[^<]*<\/span>/g,
        (match, fieldName) => {
          const field = contract.fields.find((f) => f.name === fieldName);
          const displayText = field?.value || fieldName || "";
          return `<span>${displayText}</span>`;
        }
      );

      tempDiv.innerHTML = cleanedContent;

      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const paddingTop = 10;
      const paddingHorizontal = 10;
      const maxWidth = pdfWidth - 2 * paddingHorizontal;
      const ratio = Math.min(maxWidth / imgWidth, pdfHeight / imgHeight);
      const scaledWidth = imgWidth * ratio;
      const scaledHeight = imgHeight * ratio;
      const xOffset = paddingHorizontal;
      const yOffset = paddingTop;

      pdf.addImage(imgData, "PNG", xOffset, yOffset, scaledWidth, scaledHeight);
      pdf.save(
        `${
          contentRef.current.innerText.substring(0, 20).replace(/\s+/g, "_") ||
          "contract"
        }.pdf`
      );

      document.body.removeChild(tempDiv);
    } catch (error) {
      console.error("Error generating PDF:", error);
      setError("An error occurred while generating the PDF.");
    }
  };

  return (
    <div>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Button onClick={handleExportToPDF} className="mt-4">
        <FileText className="h-4 w-4 mr-2" />
        Export to PDF
      </Button>
    </div>
  );
};

export default function ContractPreview({
  contract,
  mode,
}: ContractPreviewProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  const replacePlaceholders = (content: string) => {
    return content.replace(
      /<span\s*(?:data-placeholder="([^"]+)")?\s*(?:class="[^"]*")?>[^<]*<\/span>/g,
      (match, fieldName) => {
        const field = contract.fields.find((f) => f.name === fieldName);
        console.log(
          `Processing placeholder: ${fieldName}, Found field:`,
          field
        );
        if (field && field.value) {
          return field.value;
        }
        return `<span class="inline-block bg-blue-100 text-blue-800 rounded px-1.5 py-0.5 text-sm font-medium" data-placeholder="${fieldName}">${fieldName}</span>`;
      }
    );
  };

  const processedContent = contract.content
    ? replacePlaceholders(contract.content)
    : "";

  console.log(mode);

  return (
    <Card>
      <CardContent>
        <div className="prose max-w-none mt-3">
          {contract.content ? (
            <>
              <div
                ref={contentRef}
                className="prose max-w-none leading-normal mb-2"
                dangerouslySetInnerHTML={{
                  __html: processedContent,
                }}
              />
              <ExportToPDF contentRef={contentRef} contract={contract} />
            </>
          ) : (
            <p>No content available.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
