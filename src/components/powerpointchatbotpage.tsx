"use client";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import Highlights from "./youtube/videohighlights";
import PowerpointChat from "./powerpoint/powerpointchatbot";
import PowerpointInput from "./powerpoint/powerpointinput";

export default function PowerpointChatbotPage() {
  const [videoSummary, setVideoSummary] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [threadId, setThreadId] = useState("");
  const [highlights, setHighlights] = useState("");
  const [chatbotAssistantID, setChatbotAssistantID] = useState("");
  const [powerpointFile, setPowerpointFile] = useState(null); // Store the PDF file
  const [pdfFileName, setPdfFileName] = useState(""); // Store the PDF file name

  return (
    <div className="flex flex-col items-center min-h-screen p-4">
      <div className="w-full max-w-6xl mx-auto space-y-4">
        <PowerpointInput
          powerpointFile={powerpointFile}
          setVideoSummary={setVideoSummary}
          setVideoTitle={setVideoTitle}
          setThreadId={setThreadId}
          setHighlights={setHighlights}
          setChatbotAssistantID={setChatbotAssistantID}
          setPowerpointFile={
            setPowerpointFile as Dispatch<SetStateAction<File | null>>
          } // Update the type of setPdfFile
          setPdfFileName={setPdfFileName} // Make sure to pass this
        />
        {threadId && (
          <div className="flex flex-col md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-4 w-full">
            <div className="flex-1">
              <PowerpointChat
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
