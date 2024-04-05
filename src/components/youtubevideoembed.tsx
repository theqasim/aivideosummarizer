import React from "react";

interface YouTubeEmbedProps {
  videoId: string;
}

const YouTubeEmbed = ({ videoId }: YouTubeEmbedProps) => {
  const embedUrl = `https://www.youtube.com/embed/${videoId}`;

  return (
    <div
      style={{
        overflow: "hidden",
        paddingBottom: "56.25%",
        position: "relative",
        height: "0",
      }}
    >
      <iframe
        src={embedUrl}
        style={{
          left: "0",
          top: "0",
          height: "100%",
          width: "100%",
          position: "absolute",
        }}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Embedded YouTube Video"
      ></iframe>
    </div>
  );
};

export default YouTubeEmbed;
