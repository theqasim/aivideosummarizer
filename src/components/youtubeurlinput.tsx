"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface YouTubeURLInputProps {
  youtubeURL: string;
  setYoutubeURL: React.Dispatch<React.SetStateAction<string>>;
  setVideoSummary: React.Dispatch<React.SetStateAction<string>>;
  setVideoTranscript: React.Dispatch<React.SetStateAction<string>>;
}

export default function YouTubeURLInput({
  youtubeURL,
  setYoutubeURL,
  setVideoSummary,
  setVideoTranscript,
}: YouTubeURLInputProps) {
  // State to hold the input value
  // const [youtubeURL, setYoutubeURL] = useState("");

  // Function to update state with the input value
  const handleInputChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setYoutubeURL(e.target.value);
  };

  // Event handler for form submission
  const handleSubmit = async () => {
    if (!youtubeURL) {
      alert("Please enter a YouTube URL.");
      return;
    }

    try {
      const response = await fetch("/api/extraction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: youtubeURL }),
      });

      if (!response.ok) {
        // This will capture HTTP status codes such as 400 and 500.
        // You could also alert or display the error message from the response here
        const errorData = await response.json(); // Assuming the server responds with JSON-formatted error messages
        console.error("Error fetching summary:", errorData);
        alert(`Failed to generate summary: ${errorData.error}`);
        return; // Exit early on error
      }

      const { formattedTranscript, title } = await response.json(); // Parse the JSON data from the response
      console.log(formattedTranscript); // Log to verify the fetched data
      console.log("Fetched Title:", title);

      // Assuming formattedTranscript is the data you want to summarize
      const summaryResponse = await fetch("/api/summarise", {
        // Adjust the endpoint as necessary
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Format the transcript according to the expected message structure
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: `As an AI, your primary role is to analyze and summarize key insights from a specific video's content, using the provided transcript. Focus on identifying and explaining the main themes, notable points, and any significant moments mentioned in the transcript. Avoid speculation and restrict your analysis to the content of the transcript. Aim to provide concise, insightful summaries that reflect a deep understanding of the video's subject matter. Here are some questions to guide your analysis: - What are the main themes discussed in the video? - Are there any surprising or particularly noteworthy points made? - Can you identify any recurring patterns or ideas in the dialogue? Based on this transcript, please provide a detailed analysis answering the above questions, ensuring your insights are directly derived from and supported by the transcript content.(
                0,
                100
              )}`,
            },
            { role: "user", content: formattedTranscript },
          ],
        }),
      });

      if (!summaryResponse.ok) {
        const errorData = await summaryResponse.json();
        console.error("Error fetching summary:", errorData);
        alert(`Failed to summarize: ${errorData.error}`);
        return; // Exit early on error
      }

      const { summary } = await summaryResponse.json();
      console.log("Summary:", summary);
      setVideoSummary(summary); // Assuming you want to update the parent state with the summary
      setVideoTranscript(summary); // Update parent state
    } catch (error) {
      console.error("Error fetching summary:", error);
      alert("Failed to generate summary. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-5xl font-bold text-center mb-6">
        YouTube Video Summarizer
      </h1>
      <p className="text-lg text-center mb-8">
        Get YouTube transcript and use AI to summarize YouTube videos in one
        click for free online with NoteGPT's YouTube summary tool.
      </p>
      <div className="flex justify-center items-center border-2 border-dashed border-orange-400 rounded-lg p-4">
        <Input
          className="flex-1 mr-4"
          placeholder="https://www.youtube.com/watch?v=l2dpEjmMJ0w"
          type="text"
          value={youtubeURL}
          onChange={handleInputChange}
        />
        <Button
          className="bg-orange-500 hover:bg-orange-600 text-white"
          onClick={handleSubmit}
        >
          Generate Summary
        </Button>
      </div>
    </div>
  );
}
