"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import LoadingModal from "./loadingmodal";
import localFont from "next/font/local";

const fontspring = localFont({
  src: "../.././public/fonts/Fontspring-integralcf-bold.otf",
});

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
  const [isLoading, setIsLoading] = useState(false);

  const [loadingText, setLoadingText] = useState(
    "Retrieving video, please wait..."
  );
  const [loadingTextColor, setLoadingTextColor] = useState("text-black");
  const [videoAnalysed, setVideoAnalysed] = useState(false);
  const [loadingVisibility, setLoadingVisibility] = useState("block");
  const [closeVisibility, setCloseVisibility] = useState("none");
  const [generateSummaryButtonText, setGenerateSummaryButtonText] =
    useState("Analyse Video");
  const handleInputChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setYoutubeURL(e.target.value);
  };
  const resetAllStates = () => {
    setYoutubeURL("");
    setVideoSummary("");
    setVideoTranscript("");
    setVideoTitle("");
    setVideoId("");
    setThreadId("");
    setHighlights("");
    setIsLoading(false);
    setLoadingText("Retrieving video, please wait...");
    setLoadingTextColor("text-black");
    setLoadingVisibility("block");
    setCloseVisibility("none");
    setVideoAnalysed(false);
    setGenerateSummaryButtonText("Analyse Video");
  };

  // Include this button in your component's return statement
  <button onClick={resetAllStates} className="your-button-classes">
    Reset Page
  </button>;

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  const handleCloseModal = () => {
    setIsLoading(false);
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
          "Error Analyzing Video: Your video has no subtitles available therefore it cannot be analysed"
        );
        setLoadingTextColor("text-red-500");
        return;
      }

      let { formattedTranscript, title, videoID, longTranscriptLengthStatus } =
        await response.json();

      setVideoId(videoID);

      if (longTranscriptLengthStatus == true) {
        setLoadingText(
          "We've detected a longer video, so we'll need a bit more time to craft your summary and get our chatbot ready for you. Thank you for your patience!"
        );
        setLoadingTextColor("text-black");
        console.log("Long Video Transcript Endpoint being used");
        endpoint = "/api/longassistantinitial";
      } else {
        setLoadingText(
          "Just a moment while we tailor your video summary and prepare our chatbot for interaction."
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
        alert(`Failed to summarise: ${errorData.error}`);
        return;
      }

      const { summary, threadId, highlights } = await summaryResponse.json();
      setVideoTitle(title);
      setHighlights(highlights);
      setThreadId(threadId);
      setVideoTranscript(formattedTranscript);
      setVideoSummary(summary);
      setGenerateSummaryButtonText("Analyse another video");
      setVideoAnalysed(true);
      setIsLoading(false);
      scrollToBottom();
    } catch (error) {
      console.error("Error fetching summary:", error);
      alert("Failed to generate summary. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 dark:bg-dot-white/[0.2] bg-dot-black/[0.2]">
      {isLoading && (
        <LoadingModal
          text={loadingText}
          loadingVisibility={loadingVisibility}
          textColor={loadingTextColor}
          onClose={handleCloseModal}
          closeVisibility={closeVisibility}
        />
      )}

      <h1
        className={`text-4xl md:text=5xl sm:text-4x1 text-center mb-6 animate-fade-up animate-once animate-duration-[750ms] ${fontspring.className} `}
      >
        AI YouTube Video Summariser Chatbot
      </h1>
      <p className="text-lg text-center mb-8 animate-fade-up animate-once animate-duration-[500ms]">
        Discover insights from YouTube videos in seconds. Simply enter the URL
        of a YouTube video to receive a detailed summary, the highlights, and
        access to a chatbot that&apos;s trained specifically on the video&apos;s
        content.
      </p>
      <div className="flex justify-center items-center border-2 border-dashed border-red-600 rounded-lg p-4">
        <Input
          className="flex-1 mr-4"
          placeholder="https://www.youtube.com/watch?v=l2dpEjmMJ0w"
          type="text"
          value={youtubeURL}
          onChange={handleInputChange}
        />
        <button
          onClick={videoAnalysed ? resetAllStates : handleSubmit}
          className={`relative inline-flex h-12 overflow-hidden hover:shadow-lg transition duration-300 ease-in-out dark:hover:shadow-white/30 rounded-full p-[1px] hover: focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50`}
        >
          <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
          <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
            {generateSummaryButtonText}
          </span>
        </button>
      </div>
    </div>
  );
}
