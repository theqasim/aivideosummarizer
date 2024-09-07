"use client";

import React, { useState, useRef } from "react";
import LoadingModal from "../loadingmodal";
import localFont from "next/font/local";

const fontspring = localFont({
  src: "../../.././public/fonts/Fontspring-integralcf-bold.otf",
});

interface SttInputProps {
  setVideoSummary: React.Dispatch<React.SetStateAction<string>>;
  setVideoTitle: React.Dispatch<React.SetStateAction<string>>;
  setThreadId: React.Dispatch<React.SetStateAction<string>>;
  setHighlights: React.Dispatch<React.SetStateAction<string>>;
  setChatbotAssistantID: React.Dispatch<React.SetStateAction<string>>;
}

export default function SttInput({
  setVideoSummary,
  setVideoTitle,
  setThreadId,
  setHighlights,
  setChatbotAssistantID,
}: SttInputProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState<string>("");
  const recognitionRef = useRef<null | any>(null); // Ref to hold the recognition instance

  const [loadingText, setLoadingText] = useState(
    "Retrieving video, please wait..."
  );
  const [loadingTextColor, setLoadingTextColor] = useState("text-black");
  const [loadingVisibility, setLoadingVisibility] = useState("block");
  const [closeVisibility, setCloseVisibility] = useState("none");

  const handleCloseModal = () => {
    setIsLoading(false);
  };

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
  };

  const handleStartStopRecording = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      setIsLoading(true);
      setLoadingText("Processing transcription...");

      // Send the transcription to the backend API
      fetch("/api/assistantinitialstt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sstTranscript: transcription }),
      })
        .then((response) => response.json())
        .then((data) => {
          setVideoTitle("Speech Recording");
          setHighlights(data.highlights);
          setThreadId(data.threadId);
          setVideoSummary(data.summary);
          setChatbotAssistantID(data.assistant_id);
        })
        .catch((error) => {
          console.error("Error:", error);
        })
        .finally(() => {
          setIsLoading(false);
        });

      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognitionRef.current = recognition; // Store the recognition instance

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event);
      setIsLoading(false);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.onresult = (event: any) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + " ";
        }
      }
      setTranscription(
        (prevTranscription) => prevTranscription + finalTranscript.trim()
      );
    };

    recognition.start();
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
        className={`text-4xl md:text-5xl sm:text-4xl text-center mb-6 animate-fade-up animate-once animate-duration-[750ms] ${fontspring.className}`}
      >
        AI Speech to Text Summariser Chatbot
      </h1>
      <p className="text-lg text-center mb-8 animate-fade-up animate-once animate-duration-[500ms]">
        Discover insights from your speech. Simply click the button below to
        start speaking and receive a detailed summary, highlights, and access to
        a chatbot trained on your speech content.
      </p>
      <div className="flex justify-center items-center border-2 border-dashed border-red-600 rounded-lg p-4">
        <button
          onClick={handleStartStopRecording}
          className="relative inline-flex h-12 overflow-hidden hover:shadow-lg transition duration-300 ease-in-out dark:hover:shadow-white/30 rounded-full p-[1px] hover:focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 cursor-pointer"
        >
          <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
          <span className="inline-flex h-full w-full items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6 mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 18.75c4.124 0 7.5-3.376 7.5-7.5V5.25a.75.75 0 0 0-1.5 0v6c0 3.314-2.686 6-6 6s-6-2.686-6-6v-6a.75.75 0 0 0-1.5 0v6c0 4.124 3.376 7.5 7.5 7.5ZM8.25 9a.75.75 0 0 1 1.5 0v2.25a.75.75 0 0 1-1.5 0V9ZM12 3.75c-.621 0-1.125.504-1.125 1.125v6a1.125 1.125 0 0 0 2.25 0v-6C13.125 4.254 12.621 3.75 12 3.75ZM16.5 9a.75.75 0 0 1 1.5 0v2.25a.75.75 0 0 1-1.5 0V9Z"
              />
            </svg>
            {isRecording ? "Stop Recording" : "Start Recording"}
          </span>
        </button>
      </div>
      {transcription && (
        <div className="mt-4">
          <h2 className="text-2xl mb-2">Transcription:</h2>
          <p>{transcription}</p>
        </div>
      )}
    </div>
  );
}
