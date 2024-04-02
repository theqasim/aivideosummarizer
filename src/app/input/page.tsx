"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Component() {
  // State to hold the input value
  const [youtubeURL, setYoutubeURL] = useState("");

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

      const data = await response.json(); // Parse the JSON data from the response
      console.log(data.title);
      console.log(data.formattedTranscript);
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
