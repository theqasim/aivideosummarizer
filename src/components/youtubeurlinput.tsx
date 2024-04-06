"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import LoadingModal from "./loadingmodal";

interface YouTubeURLInputProps {
  youtubeURL: string;
  setYoutubeURL: React.Dispatch<React.SetStateAction<string>>;
  setVideoSummary: React.Dispatch<React.SetStateAction<string>>;
  setVideoTranscript: React.Dispatch<React.SetStateAction<string>>;
  setVideoTitle: React.Dispatch<React.SetStateAction<string>>;
  setVideoId: React.Dispatch<React.SetStateAction<string>>;
  setThreadId: React.Dispatch<React.SetStateAction<string>>;
}

export default function YouTubeURLInput({
  youtubeURL,
  setYoutubeURL,
  setVideoSummary,
  setVideoTranscript,
  setVideoTitle,
  setVideoId,
  setThreadId,
}: YouTubeURLInputProps) {
  const [isLoading, setIsLoading] = useState(false); // Correct as is
  const [loadingText, setLoadingText] = useState(
    "Retrieving video, please wait...",
  ); // Initialize with a string
  const [loadingTextColor, setLoadingTextColor] = useState("text-black"); // Keep consistent naming

  // Function to update state with the input value
  const handleInputChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setYoutubeURL(e.target.value);
  };

  // Event handler for form submission
  const handleSubmit = async () => {
    const youtubeUrlPattern =
      /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;

    if (!youtubeURL) {
      alert("Please enter a YouTube URL.");
      return;
    } else if (!youtubeUrlPattern.test(youtubeURL)) {
      alert("Please enter a valid YouTube video URL.");
      return;
    }

    setIsLoading(true); // Start loading before fetch calls

    try {
      let endpoint = "/api/assistantinitial";

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

      let { formattedTranscript, title, videoID, longTranscriptLengthStatus } =
        await response.json(); // Parse the JSON data from the response
      // console.log(formattedTranscript); // Log to verify the fetched data
      // console.log("Fetched Title:", title);
      // console.log("YouTube Video ID: " + videoID);
      // console.log("Long Transcript Video: " + longTranscriptLengthStatus);
      setVideoId(videoID);

      console.log(
        "transcription length status before the if block" +
          longTranscriptLengthStatus,
      );

      if (longTranscriptLengthStatus == true) {
        setLoadingText(
          "We've detected a longer video, so we'll need a bit more time to craft your summary and get our chatbot ready for you. Thank you for your patience!",
        );
        setLoadingTextColor("text-black");
        console.log("Long Video Transcript Endpoint being used");
        endpoint = "/api/longassistantinitial";
      } else {
        setLoadingText(
          "Just a moment while we tailor your video summary and prepapre our chatbot for interaction.",
        );
        setLoadingTextColor("text-black");
      }

      const summaryResponse = await fetch(endpoint, {
        // Adjust the endpoint as necessary
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Format the transcript according to the expected message structure
        body: JSON.stringify({ transcript: formattedTranscript }),
      });

      if (!summaryResponse.ok) {
        setIsLoading(false);
        const errorData = await summaryResponse.json();
        console.error("Error fetching summary:", errorData);
        alert(`Failed to summarize: ${errorData.error}`);
        return; // Exit early on error
      }

      const { summary, threadId } = await summaryResponse.json();
      console.log("Summary:", summary);
      setVideoTitle(title);
      setThreadId(threadId);
      setVideoTranscript(formattedTranscript); // Update parent state
      setVideoSummary(summary);
      setIsLoading(false); // Stop loading after all operations are done
    } catch (error) {
      console.error("Error fetching summary:", error);
      alert("Failed to generate summary. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      {isLoading && (
        <LoadingModal text={loadingText} textColor={loadingTextColor} />
      )}

      <h1 className="text-5xl font-bold text-center mb-6">
        YouTube Video Summarizer
      </h1>
      <p className="text-lg text-center mb-8">
        Get YouTube transcript and use AI to summarize YouTube videos in one
        click for free online with NoteGPT's YouTube summary tool.
      </p>
      <div className="flex justify-center items-center border-2 border-dashed border-red-600 rounded-lg p-4">
        <Input
          className="flex-1 mr-4"
          placeholder="https://www.youtube.com/watch?v=l2dpEjmMJ0w"
          type="text"
          value={youtubeURL}
          onChange={handleInputChange}
        />
        <Button
          className=" text-white hover:cursor-pointer"
          onClick={handleSubmit}
        >
          Generate Summary
        </Button>
      </div>
    </div>
  );
}
