"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import LoadingModal from "../loadingmodal";
import localFont from "next/font/local";
import { pdfToText } from "pdf-ts";

const fontspring = localFont({
  src: "../../.././public/fonts/Fontspring-integralcf-bold.otf",
});

interface YouTubeURLInputProps {
  userText: string;
  setUserText: React.Dispatch<React.SetStateAction<string>>;
  setVideoSummary: React.Dispatch<React.SetStateAction<string>>;
  setVideoTranscript: React.Dispatch<React.SetStateAction<string>>;
  setVideoTitle: React.Dispatch<React.SetStateAction<string>>;
  setVideoId: React.Dispatch<React.SetStateAction<string>>;
  setThreadId: React.Dispatch<React.SetStateAction<string>>;
  setHighlights: React.Dispatch<React.SetStateAction<string>>;
  setChatbotAssistantID: React.Dispatch<React.SetStateAction<string>>;
  pdfFile: File | null;
  setPdfFile: React.Dispatch<React.SetStateAction<File | null>>;
  setPdfFileName: React.Dispatch<React.SetStateAction<string>>;
}

export default function TextInput({
  userText,
  setUserText,
  setVideoSummary,
  setVideoTranscript,
  setVideoTitle,
  setVideoId,
  setThreadId,
  setHighlights,
  setChatbotAssistantID,
  pdfFile,
  setPdfFile,
  setPdfFileName,
}: YouTubeURLInputProps) {
  const [isLoading, setIsLoading] = useState(false);

  const [loadingText, setLoadingText] = useState(
    "Analysing text, please wait...",
  );
  const [loadingTextColor, setLoadingTextColor] = useState("text-black");
  const [videoAnalysed, setVideoAnalysed] = useState(false);
  const [loadingVisibility, setLoadingVisibility] = useState("block");
  const [closeVisibility, setCloseVisibility] = useState("none");
  const [generateSummaryButtonText, setGenerateSummaryButtonText] =
    useState("Analyse Text");
  const handleInputChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setUserText(e.target.value);
  };
  const resetAllStates = () => {
    setUserText("");
    setVideoSummary("");
    setVideoTranscript("");
    setVideoTitle("");
    setVideoId("");
    setThreadId("");
    setChatbotAssistantID("");
    setHighlights("");
    setIsLoading(false);
    setLoadingText("Analysing text, please wait...");
    setLoadingTextColor("text-black");
    setLoadingVisibility("block");
    setCloseVisibility("none");
    setVideoAnalysed(false);
    setGenerateSummaryButtonText("Analyse Text");
  };

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
    setLoadingVisibility("block");
    setCloseVisibility("none");
    setLoadingTextColor("text-black");
    setLoadingText("Analysing text, please wait...");

    setIsLoading(true);

    try {
      if (parseInt(userText) === 100000) {
        setLoadingText(
          "We've detected a large amount of text, so we'll need a bit more time to craft your summary and get our chatbot ready for you. Thank you for your patience!",
        );
        setLoadingTextColor("text-black");
      } else {
        setLoadingText(
          "Just a moment while we tailor your text summary and prepare our chatbot for interaction.",
        );
        setLoadingTextColor("text-black");
      }

      const summaryResponse = await fetch("/api/assistantinitialtext", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: userText }),
      });

      if (!summaryResponse.ok) {
        const errorData = await summaryResponse.json();
        setLoadingVisibility("none");
        setCloseVisibility("block");
        setLoadingText(
          "Error Analysing Text: We were unable to summarise your text, please try again later.",
        );
        setLoadingTextColor("text-red-500");
        return;
      }

      const { summary, threadId, highlights, chatbotAssistantID } =
        await summaryResponse.json();
      setHighlights(highlights);
      setThreadId(threadId);
      setVideoSummary(summary);
      setChatbotAssistantID(chatbotAssistantID);
      setGenerateSummaryButtonText("Analyse more text");
      setVideoAnalysed(true);
      setIsLoading(false);
      scrollToBottom();
    } catch (error) {
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
        AI Text Video Summariser Chatbot
      </h1>
      <p className="text-lg text-center mb-8 animate-fade-up animate-once animate-duration-[500ms]">
        Discover insights from text in seconds. Simply enter text to receive a
        detailed summary, the highlights, and access to a chatbot that&apos;s
        trained specifically on the text you've entered.
      </p>
      <div className="flex flex-col space-y-4 justify-center p-10 items-center border-2 border-dashed border-red-600 rounded-lg p-4">
        <textarea
          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Enter your text..."
          rows={5}
          value={userText}
          onChange={handleInputChange}
        />
        <button
          onClick={videoAnalysed ? resetAllStates : handleSubmit}
          className={`relative inline-flex h-12 mr-2 overflow-hidden hover:shadow-lg transition duration-300 ease-in-out dark:hover:shadow-white/30 rounded-full p-[1px] hover: focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50`}
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
