"use client";

import React, { useEffect, useState } from "react";
import Chat from "./chatbot";
import YouTubeURLInput from "./youtubeurlinput";

export default function VideoChatPage() {
  const [youtubeURL, setYoutubeURL] = useState("");
  const [videoSummary, setVideoSummary] = useState("");
  const [videoTranscript, setVideoTranscript] = useState("");
  const [videoTitle, setVideoTitle] = useState("");

  // Add more state and handlers here as necessary

  useEffect(() => {
    console.log("videoTranscript updated:", videoTranscript);
  }, [videoTranscript]);

  return (
    <div className="">
      <YouTubeURLInput
        youtubeURL={youtubeURL}
        setYoutubeURL={setYoutubeURL}
        setVideoSummary={setVideoSummary}
        setVideoTranscript={setVideoTranscript}
        setVideoTitle={setVideoTitle}
      />

      {/* Chat Component */}
      {videoTranscript && (
        <Chat videoTranscript={videoTranscript} videoTitle={videoTitle} />
      )}
    </div>
  );
}
