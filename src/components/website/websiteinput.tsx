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
  userURL: string;
  setUserURL: React.Dispatch<React.SetStateAction<string>>;
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

export default function WebsiteInput({
  userURL,
  setUserURL,
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
    "Analysing text, please wait..."
  );
  const [loadingTextColor, setLoadingTextColor] = useState("text-black");
  const [videoAnalysed, setVideoAnalysed] = useState(false);
  const [loadingVisibility, setLoadingVisibility] = useState("block");
  const [closeVisibility, setCloseVisibility] = useState("none");
  const [generateSummaryButtonText, setGenerateSummaryButtonText] = useState(
    "Analyse Website Content"
  );
  const handleInputChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setUserURL(e.target.value);
  };
  const resetAllStates = () => {
    setUserURL("");
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
    setGenerateSummaryButtonText("Analyse Website Content");
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
    setLoadingText("Analysing website, please wait...");

    setIsLoading(true);

    try {
      setLoadingText(
        "Just a moment while we tailor your text summary and prepare our chatbot for interaction."
      );
      setLoadingTextColor("text-black");

      // const response = await fetch(userURL);
      // const html = await response.text();
      // const parser = new DOMParser();
      // const doc = parser.parseFromString(html, "text/html");

      // // Example: Extract text from all paragraph tags
      // const paragraphs = doc.querySelectorAll("p");
      // const allText = Array.from(paragraphs)
      //   .map((p) => p?.textContent?.trim())
      //   .filter((t) => t)
      //   .join("\n");

      // console.log("user webistes text:", allText);

      console.log("userURL", userURL);
      const websiteTextExtractionResponse = await fetch(
        "/api/extractwebsitecontent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userUrl: userURL }),
        }
      );

      if (!websiteTextExtractionResponse.ok) {
        setLoadingVisibility("none");
        setCloseVisibility("block");
        setLoadingText(
          "Error Extracting Website Content: We were unable to extract content from the website, please try again later."
        );
        setLoadingTextColor("text-red-500");
        return;
      }

      const { extractedText } = await websiteTextExtractionResponse.json();

      console.log("user websites text:", extractedText);

      const summaryResponse = await fetch("/api/assistantinitialwebsite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: extractedText }),
      });

      if (!summaryResponse.ok) {
        const errorData = await summaryResponse.json();
        setLoadingVisibility("none");
        setCloseVisibility("block");
        setLoadingText(
          "Error Analysing Text: We were unable to summarise your text, please try again later."
        );
        setLoadingTextColor("text-red-500");
        return;
      }

      const { summary, threadId, highlights, assistant_id } =
        await summaryResponse.json();
      setHighlights(highlights);
      setThreadId(threadId);
      setVideoSummary(summary);
      setChatbotAssistantID(assistant_id);
      setGenerateSummaryButtonText("Analyse another website");
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
        AI Website Summariser Chatbot
      </h1>
      <p className="text-lg text-center mb-8 animate-fade-up animate-once animate-duration-[500ms]">
        Discover insights from websites in seconds. Simply enter a URL to
        receive a detailed summary, the highlights, and access to a chatbot
        that&apos;s trained specifically on the URL you&apos;ve entered.
      </p>
      <div className="flex justify-center items-center border-2 border-dashed border-red-600 rounded-lg p-4">
        <Input
          className="flex-1 mr-4"
          placeholder="https://www.ibm.com/topics/artificial-intelligence"
          type="text"
          value={userURL}
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
