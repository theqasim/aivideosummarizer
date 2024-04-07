"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import LoadingModal from "./loadingmodal";

interface YouTubeURLInputProps {
  youtubeURL: string;
  setYoutubeURL: React.Dispatch<React.SetStateAction<string>>;
  setVideoSummary: React.Dispatch<React.SetStateAction<string>>;
  setVideoTranscript: React.Dispatch<React.SetStateAction<string>>;
  setVideoTitle: React.Dispatch<React.SetStateAction<string>>;
  setVideoId: React.Dispatch<React.SetStateAction<string>>;
  setThreadId: React.Dispatch<React.SetStateAction<string>>;
  setHighlights: React.Dispatch<React.SetStateAction<string>>;
}

export default function YouTubeURLInput({
  youtubeURL,
  setYoutubeURL,
  setVideoSummary,
  setVideoTranscript,
  setVideoTitle,
  setVideoId,
  setThreadId,
  setHighlights,
}: YouTubeURLInputProps) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false); // Correct as is
  const [isGenerateSummaryButtonDisabled, SetIsGenerateSummaryButtonDisabled] =
    useState(false);
  const [loadingText, setLoadingText] = useState(
    "Retrieving video, please wait...",
  ); // Initialize with a string
  const [loadingTextColor, setLoadingTextColor] = useState("text-black"); // Keep consistent naming
  const [loadingVisibility, setLoadingVisibility] = useState("block");
  const [closeVisibility, setCloseVisibility] = useState("none");
  const [generateSummaryButtonText, setGenerateSummaryButtonText] =
    useState("Generate Summary");
  // Function to update state with the input value
  const handleInputChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setYoutubeURL(e.target.value);
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  const handleCloseModal = () => {
    setIsLoading(false); // Set the modal to be invisible
  };

  const pasteClipboardContent = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setYoutubeURL(text); // Assuming setYoutubeURL is your state setter function for the YouTube URL
    } catch (error) {
      console.error("Error pasting content from clipboard:", error);
      console.log("loading visibility:" + loadingVisibility);
      alert(
        "Failed to paste content from clipboard. Make sure to give permission if prompted.",
      );
    }
    // console.log("being pushed");
    // router.push("http://localhost:3000");
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
    setLoadingVisibility("block");
    setCloseVisibility("none");
    setLoadingTextColor("text-black");
    setLoadingText("Retrieving video, please wait...");

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
        // alert(`Failed to generate summary: ${errorData.error}`);
        setLoadingVisibility("none");
        setCloseVisibility("block");
        setLoadingText(
          "Error Analyzing Video: Your video has no subtitles available therefore it cannot be analyzed",
        );
        setLoadingTextColor("text-red-500");
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
          "Just a moment while we tailor your video summary and prepare our chatbot for interaction.",
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

      const { summary, threadId, highlights } = await summaryResponse.json();
      console.log("Summary:", summary);
      console.log("Highlights from API:" + highlights);
      setVideoTitle(title);
      setHighlights(highlights);
      setThreadId(threadId);
      setVideoTranscript(formattedTranscript); // Update parent state
      setVideoSummary(summary);
      setGenerateSummaryButtonText("Video Summarised");
      SetIsGenerateSummaryButtonDisabled(true);
      setIsLoading(false); // Stop loading after all operations are done
      scrollToBottom();
    } catch (error) {
      console.error("Error fetching summary:", error);
      alert("Failed to generate summary. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      {isLoading && (
        <LoadingModal
          text={loadingText}
          loadingVisibility={loadingVisibility}
          textColor={loadingTextColor}
          onClose={handleCloseModal}
          closeVisibility={closeVisibility}
        />
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
          className="flex items-center mr-2 justify-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded hover:cursor-pointer"
          onClick={pasteClipboardContent}
        >
          <svg
            className="w-6 h-6" // Adjust size as needed
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 5.00005C7.01165 5.00082 6.49359 5.01338 6.09202 5.21799C5.71569 5.40973 5.40973 5.71569 5.21799 6.09202C5 6.51984 5 7.07989 5 8.2V17.8C5 18.9201 5 19.4802 5.21799 19.908C5.40973 20.2843 5.71569 20.5903 6.09202 20.782C6.51984 21 7.07989 21 8.2 21H15.8C16.9201 21 17.4802 21 17.908 20.782C18.2843 20.5903 18.5903 20.2843 18.782 19.908C19 19.4802 19 18.9201 19 17.8V8.2C19 7.07989 19 6.51984 18.782 6.09202C18.5903 5.71569 18.2843 5.40973 17.908 5.21799C17.5064 5.01338 16.9884 5.00082 16 5.00005M8 5.00005V7H16V5.00005M8 5.00005V4.70711C8 4.25435 8.17986 3.82014 8.5 3.5C8.82014 3.17986 9.25435 3 9.70711 3H14.2929C14.7456 3 15.1799 3.17986 15.5 3.5C15.8201 3.82014 16 4.25435 16 4.70711V5.00005M12 11V17M12 11L14 13M12 11L10 13"
              stroke="#000000"
              className="stroke-2"
            />
          </svg>
        </Button>
        <Button
          disabled={isGenerateSummaryButtonDisabled}
          onClick={handleSubmit}
        >
          {generateSummaryButtonText}
        </Button>
      </div>
    </div>
  );
}
