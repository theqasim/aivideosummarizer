"use client";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import Chat from "./youtube/chatbot";
import YouTubeURLInput from "./youtube/youtubeurlinput";
import Highlights from "./youtube/videohighlights";
import YouTubeEmbed from "./youtube/youtubevideoembed";

export default function VideoChatPage() {
  const [youtubeURL, setYoutubeURL] = useState("");
  const [videoSummary, setVideoSummary] = useState("");
  const [videoTranscript, setVideoTranscript] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [videoId, setVideoId] = useState("");
  const [threadId, setThreadId] = useState("");
  const [highlights, setHighlights] = useState("");
  const [chatbotAssistantID, setChatbotAssistantID] = useState("");
  const [pdfFile, setPdfFile] = useState(null); // Store the PDF file
  const [pdfFileName, setPdfFileName] = useState(""); // Store the PDF file name

  return (
    <div className="flex flex-col items-center min-h-screen p-4">
      <div className="w-full max-w-6xl mx-auto space-y-4">
        <YouTubeURLInput
          youtubeURL={youtubeURL}
          pdfFile={pdfFile}
          setYoutubeURL={setYoutubeURL}
          setVideoSummary={setVideoSummary}
          setVideoTranscript={setVideoTranscript}
          setVideoTitle={setVideoTitle}
          setVideoId={setVideoId}
          setThreadId={setThreadId}
          setHighlights={setHighlights}
          setChatbotAssistantID={setChatbotAssistantID}
          setPdfFile={setPdfFile as Dispatch<SetStateAction<File | null>>} // Update the type of setPdfFile
          setPdfFileName={setPdfFileName} // Make sure to pass this
        />

        {videoTranscript && (
          <div className="flex flex-col md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-4 w-full">
            <div className="flex-1">
              <Chat
                videoTranscript={videoTranscript}
                videoTitle={videoTitle}
                videoSummary={videoSummary}
                threadId={threadId}
                chatbotAssistantID={chatbotAssistantID}
              />
            </div>
            <div className="w-full md:w-1/2 flex-none space-y-4">
              <div className="aspect-w-16 aspect-h-9">
                <YouTubeEmbed videoId={videoId} />
              </div>

              <Highlights title={videoTitle} highlights={highlights} />
            </div>
          </div>
        )}

        {/* Optionally add a component or placeholder here to handle the PDF data */}
        {pdfFileName && (
          <div className="text-center mt-4">
            <p className="text-lg">
              PDF &quote;{pdfFileName}&quote; has been uploaded successfully!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
