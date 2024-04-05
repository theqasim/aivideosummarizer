"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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

      const { formattedTranscript, title, videoID } = await response.json(); // Parse the JSON data from the response
      console.log(formattedTranscript); // Log to verify the fetched data
      console.log("Fetched Title:", title);
      console.log("YouTube Video ID: " + videoID);
      setVideoId(videoID);

      const summaryResponse = await fetch("/api/assistantinitial", {
        // Adjust the endpoint as necessary
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Format the transcript according to the expected message structure
        body: JSON.stringify({ transcript: formattedTranscript }),
      });

      if (!summaryResponse.ok) {
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
      <div className="flex justify-center items-center border-2 border-dashed border-red-600 rounded-lg p-4">
        <Input
          className="flex-1 mr-4"
          placeholder="https://www.youtube.com/watch?v=l2dpEjmMJ0w"
          type="text"
          value={youtubeURL}
          onChange={handleInputChange}
        />
        <Button className=" text-white" onClick={handleSubmit}>
          Generate Summary
        </Button>
      </div>
    </div>
  );
}
