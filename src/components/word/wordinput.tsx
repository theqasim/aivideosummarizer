"use client";

import React, { useState } from "react";
import LoadingModal from "../loadingmodal";
import localFont from "next/font/local";
import { pdfToText } from "pdf-ts";
import { getTextExtractor } from "office-text-extractor";
import { format } from "path";

const fontspring = localFont({
  src: "../../.././public/fonts/Fontspring-integralcf-bold.otf",
});

interface PdfInputProps {
  setVideoSummary: React.Dispatch<React.SetStateAction<string>>;
  setVideoTitle: React.Dispatch<React.SetStateAction<string>>;
  setThreadId: React.Dispatch<React.SetStateAction<string>>;
  setHighlights: React.Dispatch<React.SetStateAction<string>>;
  setChatbotAssistantID: React.Dispatch<React.SetStateAction<string>>;
  wordFile: File | null;
  setWordFile: React.Dispatch<React.SetStateAction<File | null>>;
  setWordFileName: React.Dispatch<React.SetStateAction<string>>;
}

export default function WordInput({
  setVideoSummary,
  setVideoTitle,
  setThreadId,
  setHighlights,
  setChatbotAssistantID,
  wordFile,
  setWordFile,
  setWordFileName,
}: PdfInputProps) {
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
  }) => {};
  const resetAllStates = () => {
    setVideoSummary("");
    setVideoTitle("");
    setThreadId("");
    setChatbotAssistantID("");
    setHighlights("");
    setIsLoading(false);
    setLoadingText("Retrieving video, please wait...");
    setLoadingTextColor("text-black");
    setLoadingVisibility("block");
    setCloseVisibility("none");
    setVideoAnalysed(false);
    setGenerateSummaryButtonText("Analyse Video");
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

  const handleWordUpload = async (event: any) => {
    setLoadingVisibility("block");
    setCloseVisibility("none");
    setLoadingText("Processing Word Document...");
    setLoadingTextColor("text-black");
    setIsLoading(true);

    const file = event.target.files[0];
    if (
      file &&
      file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      try {
        const formData = new FormData();
        formData.append("files", event.target.files[0]);
        console.log("Form Data:", formData);
        console.log("File:", file);

        setLoadingText(
          "Just a moment while we tailor your word document summary and prepare our chatbot for interaction."
        );

        setLoadingTextColor("text-black");
        setWordFile(file);
        setWordFileName(file.name);

        try {
          const fileTextExtractionResponse = await fetch("/api/extracttext", {
            method: "POST",
            body: formData,
          });

          if (!fileTextExtractionResponse.ok) {
            setLoadingVisibility("none");
            setCloseVisibility("block");
            setLoadingText(
              "Error Extracting Text: We were unable to extract the text from your document, please try again later."
            );
            setLoadingTextColor("text-red-500");
            return;
          }

          const { extractedText } = await fileTextExtractionResponse.json();
          // console.log("Extracted Document Text:", wordText);

          let endpoint = "/api/assistantinitialword";

          const summaryResponse = await fetch(endpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ wordText: extractedText }),
          });

          if (!summaryResponse.ok) {
            const errorData = await summaryResponse.json();
            setLoadingVisibility("none");
            setCloseVisibility("block");
            setLoadingText(
              "Error Analysing Word Document: We were unable to summarise your word document, please try again later."
            );
            setLoadingTextColor("text-red-500");
            return;
          }

          const { summary, threadId, highlights, assistant_id } =
            await summaryResponse.json();
          setVideoTitle(file.name);
          setHighlights(highlights);
          setThreadId(threadId);
          setVideoSummary(summary);
          setChatbotAssistantID(assistant_id);
          console.log("Setting Assistant ID:", assistant_id);
          setGenerateSummaryButtonText("Analyse another video");
          setVideoAnalysed(true);
          setIsLoading(false);
          scrollToBottom();
        } catch (error) {
          alert("Failed to generate summary. Please try again.");
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Extraction Error:", error);
        setLoadingVisibility("none");
        setCloseVisibility("block");
        setLoadingText(`Error: ${"Failed to process the file"}`);
        setLoadingTextColor("text-red-500");
      }
    } else {
      alert("Please upload a valid word document.");
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
        AI Word Document Summariser Chatbot
      </h1>
      <p className="text-lg text-center mb-8 animate-fade-up animate-once animate-duration-[500ms]">
        Discover insights from word documents in seconds. Simply upload a word
        document to receive a detailed summary, the highlights, and access to a
        chatbot that&apos;s trained specifically on the word documents content.
      </p>
      <div className="flex justify-center items-center border-2 border-dashed border-red-600 rounded-lg p-4">
        <label className="relative inline-flex h-12 overflow-hidden hover:shadow-lg transition duration-300 ease-in-out dark:hover:shadow-white/30 rounded-full p-[1px] hover:focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 cursor-pointer">
          <input
            type="file"
            accept="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleWordUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
          <span className="inline-flex h-full w-full items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6 mr-2 "
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
              />
            </svg>
            Upload Word Document
          </span>
        </label>
      </div>
    </div>
  );
}
