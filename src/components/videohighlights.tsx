import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface HighlightsProps {
  title: string;
  highlights: string;
}

const Highlights: React.FC<HighlightsProps> = ({ title, highlights }) => {
  const [isError, setIsError] = useState(false);
  function extractBulletPoints(text: string) {
    // This regex matches a dash followed by a space and any non-whitespace character.
    // It also accounts for cases where a bullet point might start immediately after a period.
    const bulletPointRegex = /(?:\s|^)(-)\s+(\S)/g;
    return text
      .replace(bulletPointRegex, "\n$1 $2") // Replace matched patterns with a newline character
      .trim() // Trim whitespace from the start and end
      .split("\n") // Split the text into an array at each newline
      .filter(Boolean); // Remove any empty strings
  }
  const bulletPointsArray = (() => {
    try {
      return extractBulletPoints(highlights);
    } catch (error) {
      console.error("Error extracting bullet points:", error);
      setIsError(true);
      return null; // Return null to indicate failure
    }
  })();

  return (
    <Card className="shadow-lg rounded-lg max-h-[60vh] overflow-auto">
      <CardHeader className="border-b p-4 bg-gray-800">
        <CardTitle className="text-lg font-bold text-white">
          Highlights for "{title}"
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {isError || !bulletPointsArray ? (
          <p>{highlights}</p>
        ) : (
          bulletPointsArray.map(
            (
              point:
                | string
                | number
                | boolean
                | React.ReactElement<
                    any,
                    string | React.JSXElementConstructor<any>
                  >
                | Iterable<React.ReactNode>
                | React.ReactPortal
                | Promise<React.AwaitedReactNode>
                | null
                | undefined,
              index: React.Key | null | undefined,
            ) => <p key={index}>{point}</p>,
          )
        )}
      </CardContent>
    </Card>
  );
};

export default Highlights;
