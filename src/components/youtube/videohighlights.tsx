import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface HighlightsProps {
  title: string;
  highlights: string;
}

const Highlights: React.FC<HighlightsProps> = ({ title, highlights }) => {
  const [isError, setIsError] = useState(false);
  function extractBulletPoints(text: string) {
    const bulletPointRegex = /(?:\s|^)(-)\s+(\S)/g;
    return text
      .replace(bulletPointRegex, "\n$1 $2")
      .trim()
      .split("\n")
      .filter(Boolean);
  }
  const bulletPointsArray = (() => {
    try {
      return extractBulletPoints(highlights);
    } catch (error) {
      setIsError(true);
      return null;
    }
  })();

  return (
    <div>
      <Card className="shadow-lg rounded-lg max-h-[60vh] overflow-auto">
        <CardHeader className="border-b p-4 bg-gray-800">
          <CardTitle className="text-lg font-semibold text-white">
            Highlights for <b className="font-bold text-red-500">{title}</b>
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
                index: React.Key | null | undefined
              ) => <p key={index}>{point}</p>
            )
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Highlights;
