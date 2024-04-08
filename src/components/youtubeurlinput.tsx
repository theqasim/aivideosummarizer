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

  const [isLoading, setIsLoading] = useState(false);
  const [isGenerateSummaryButtonDisabled, SetIsGenerateSummaryButtonDisabled] =
    useState(false);
  const [loadingText, setLoadingText] = useState(
    "Retrieving video, please wait...",
  );
  const [loadingTextColor, setLoadingTextColor] = useState("text-black");
  const [loadingVisibility, setLoadingVisibility] = useState("block");
  const [closeVisibility, setCloseVisibility] = useState("none");
  const [generateSummaryButtonText, setGenerateSummaryButtonText] =
    useState("Generate Summary");
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
    setIsLoading(false);
  };

  const pasteClipboardContent = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setYoutubeURL(text);
    } catch (error) {
      console.error("Error pasting content from clipboard:", error);
      alert(
        "Failed to paste content from clipboard. Make sure to give permission if prompted.",
      );
    }
  };

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

    setIsLoading(true);

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
        const errorData = await response.json();
        console.error("Error fetching summary:", errorData);
        setLoadingVisibility("none");
        setCloseVisibility("block");
        setLoadingText(
          "Error Analyzing Video: Your video has no subtitles available therefore it cannot be analyzed",
        );
        setLoadingTextColor("text-red-500");
        return;
      }

      let { formattedTranscript, title, videoID, longTranscriptLengthStatus } =
        await response.json();

      setVideoId(videoID);

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
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ transcript: formattedTranscript }),
      });

      if (!summaryResponse.ok) {
        setIsLoading(false);
        const errorData = await summaryResponse.json();
        console.error("Error fetching summary:", errorData);
        alert(`Failed to summarize: ${errorData.error}`);
        return;
      }

      const { summary, threadId, highlights } = await summaryResponse.json();
      setVideoTitle(title);
      setHighlights(highlights);
      setThreadId(threadId);
      setVideoTranscript(formattedTranscript);
      setVideoSummary(summary);
      setGenerateSummaryButtonText("Video Summarised");
      SetIsGenerateSummaryButtonDisabled(true);
      setIsLoading(false);
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
        AI YouTube Video Summarizer & Chatbot
      </h1>
      <p className="text-lg text-center mb-8">
        Gain insights from YouTube videos in seconds, not hours. Enter a YouTube
        video below to be given an in depth summary, key highlights from the
        video and a chatbot trained on the content of the video.
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
            className="w-6 h-6"
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
