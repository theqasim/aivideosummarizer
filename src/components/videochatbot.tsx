"use client";
import React, { useEffect, useState } from "react";
import Chat from "./chatbot";
import YouTubeURLInput from "./youtubeurlinput";
import Highlights from "./videohighlights";
import YouTubeEmbed from "./youtubevideoembed";

export default function VideoChatPage() {
  const [youtubeURL, setYoutubeURL] = useState("");
  const [videoSummary, setVideoSummary] = useState("");
  const [videoTranscript, setVideoTranscript] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [videoId, setVideoId] = useState("");
  const [threadId, setThreadId] = useState("");
  const [highlights, setHighlights] = useState("");
  const [chatbotAssistantID, setChatbotAssistantID] = useState("");

  return (
    <div className="flex flex-col items-center min-h-screen p-4">
      <div className="w-full max-w-6xl mx-auto space-y-4">
        <YouTubeURLInput
          youtubeURL={youtubeURL}
          setYoutubeURL={setYoutubeURL}
          setVideoSummary={setVideoSummary}
          setVideoTranscript={setVideoTranscript}
          setVideoTitle={setVideoTitle}
          setVideoId={setVideoId}
          setThreadId={setThreadId}
          setHighlights={setHighlights}
          setChatbotAssistantID={setChatbotAssistantID}
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
      </div>
    </div>
  );
}
