"use client";
import React, { Dispatch, SetStateAction, useState } from "react";
import Highlights from "./youtube/videohighlights";
import Mp4Input from "./mp4/mp4input";
import Mp4Chat from "./mp4/mp4chatbot";

export default function Mp4ChatbotPage() {
  const [videoSummary, setVideoSummary] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [threadId, setThreadId] = useState("");
  const [highlights, setHighlights] = useState("");
  const [chatbotAssistantID, setChatbotAssistantID] = useState("");
  const [mp4File, setMp4File] = useState<File | null>(null); // Store the MP3 file
  const [mp4FileName, setMp4FileName] = useState(""); // Store the MP3 file name

  return (
    <div className="flex flex-col items-center min-h-screen p-4">
      <div className="w-full max-w-6xl mx-auto space-y-4">
        <Mp4Input
          mp4File={mp4File}
          setVideoSummary={setVideoSummary}
          setVideoTitle={setVideoTitle}
          setThreadId={setThreadId}
          setHighlights={setHighlights}
          setChatbotAssistantID={setChatbotAssistantID}
          setMp4File={setMp4File}
          setMp4FileName={setMp4FileName}
        />
        {threadId && (
          <div className="flex flex-col md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-4 w-full">
            <div className="flex-1">
              <Mp4Chat
                videoTitle={videoTitle}
                videoSummary={videoSummary}
                threadId={threadId}
                chatbotAssistantID={chatbotAssistantID}
              />
            </div>
            <div className="w-full md:w-1/2 flex-none space-y-4">
              <div className="aspect-w-16 aspect-h-9">
                {/* <YouTubeEmbed videoId={videoId} /> */}
              </div>
              <Highlights title={videoTitle} highlights={highlights} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
