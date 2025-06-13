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
  content,
}: {
  contentRef: React.RefObject<HTMLDivElement>;
  content: string;
}) => {
  const [error, setError] = useState<string | null>(null);

  const handleExportToPDF = async () => {
    setError(null); // Reset error state
    if (!contentRef.current) return;

    // Check for <span> elements with classes inline-block, bg-blue-100, and text-blue-800
    const hasInvalidSpans =
      /<span[^>]*class="[^"]*inline-block[^"]*bg-blue-100[^"]*text-blue-800[^"]*"[^>]*>/i.test(
        content
      );
    if (hasInvalidSpans) {
      setError("All placeholders must be filled before exporting to PDF.");
      return;
    }

    try {
      const canvas = await html2canvas(contentRef.current, {
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
              <ExportToPDF contentRef={contentRef} content={processedContent} />
            </>
          ) : (
            <p>No content available.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
