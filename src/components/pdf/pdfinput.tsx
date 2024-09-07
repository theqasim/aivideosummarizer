"use client";

import React, { useState } from "react";
import LoadingModal from "../loadingmodal";
import localFont from "next/font/local";
import { pdfToText } from "pdf-ts";
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
  pdfFile: File | null;
  setPdfFile: React.Dispatch<React.SetStateAction<File | null>>;
  setPdfFileName: React.Dispatch<React.SetStateAction<string>>;
}

export default function PdfInput({
  setVideoSummary,
  setVideoTitle,
  setThreadId,
  setHighlights,
  setChatbotAssistantID,
  pdfFile,
  setPdfFile,
  setPdfFileName,
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

  const handleSubmit = async () => {
    const youtubeUrlPattern =
      /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;

    setLoadingVisibility("block");
    setCloseVisibility("none");
    setLoadingTextColor("text-black");
    setLoadingText("Retrieving video, please wait...");

    setIsLoading(true);

    try {
      // setHighlights(highlights);
      // setThreadId(threadId);
      // setVideoSummary(summary);
      // setChatbotAssistantID(chatbotAssistantID);
      setVideoAnalysed(true);
      setIsLoading(false);
      scrollToBottom();
    } catch (error) {
      alert("Failed to generate summary. Please try again.");
    }
  };

  const cleanText = (text: string) => {
    return text
      .replace(/\s+/g, " ") // Replace multiple spaces with a single space
      .replace(/-\s+/g, "") // Correct hyphenated words
      .replace(/\.\s+/g, ".\n") // New line after sentences for better readability
      .replace(/\n\s*\n/g, "\n"); // Remove excessive new lines
  };

  const formatHeadings = (text: string) => {
    // Example pattern for headings: Assume they are all caps and followed by a newline
    return text.replace(/(^[A-Z][A-Z\s]+)$/gm, "\n\n### $1\n");
  };

  const formatLists = (text: string) => {
    // Example pattern for bullet points or numbered lists
    return text.replace(/^(\d+\.)\s+/gm, "\n$1 ");
  };

  const handlePDFUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoadingVisibility("block");
    setCloseVisibility("none");
    setLoadingText("Processing PDF...");
    setLoadingTextColor("text-black");
    setIsLoading(true);

    const file = e.target.files ? e.target.files[0] : null;
    if (file && file.type === "application/pdf") {
      const reader = new FileReader();
      reader.onload = async (event) => {
        if (event.target?.result instanceof ArrayBuffer) {
          setLoadingText(
            "Just a moment while we tailor your PDF summary and prepare our chatbot for interaction."
          );
          setLoadingTextColor("text-black");
          const arrayBuffer = event.target.result;
          const uint8Array = new Uint8Array(arrayBuffer);
          const text = await pdfToText(uint8Array);
          console.log("Extracted Text:", text);
          const cleanedText = cleanText(text);
          const formattedPDFText = formatHeadings(formatLists(cleanedText));
          console.log("Formatted Text:", formattedPDFText);
          setPdfFile(file);
          setPdfFileName(file.name);

          try {
            let endpoint = "/api/assistantinitialpdf";

            const summaryResponse = await fetch(endpoint, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ PDFText: formattedPDFText }),
            });

            if (!summaryResponse.ok) {
              const errorData = await summaryResponse.json();
              setLoadingVisibility("none");
              setCloseVisibility("block");
              setLoadingText(
                "Error Analysing PDF: We were unable to summarise your PDF, please try again later."
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
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert("Please upload a valid PDF file.");
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
        AI PDF Summariser Chatbot
      </h1>
      <p className="text-lg text-center mb-8 animate-fade-up animate-once animate-duration-[500ms]">
        Discover insights from PDF&apos;s in seconds. Simply upload a PDF to
        receive a detailed summary, the highlights, and access to a chatbot
        that&apos;s trained specifically on the PDF&apos;s content.
      </p>
      <div className="flex justify-center items-center border-2 border-dashed border-red-600 rounded-lg p-4">
        <label className="relative inline-flex h-12 overflow-hidden hover:shadow-lg transition duration-300 ease-in-out dark:hover:shadow-white/30 rounded-full p-[1px] hover:focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 cursor-pointer">
          <input
            type="file"
            // accept=".pdf"
            accept="application/pdf"
            onChange={handlePDFUpload}
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
            Upload PDF
          </span>
        </label>
      </div>
    </div>
  );
}
