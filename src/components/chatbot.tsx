"use client";
import React, { SVGProps, useEffect, useRef, useState } from "react";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card";
import { TabsTrigger, TabsList, TabsContent, Tabs } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { VideoOff } from "lucide-react";

// Assuming these icons are already defined elsewhere in your project

interface ChatProps {
  videoTranscript: string;
  videoTitle: string;
}

interface Message {
  role: "system" | "user" | "assistant"; // Updated to include 'assistant'
  content: string;
}

export default function Chat({ videoTranscript, videoTitle }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (videoTranscript) {
      setMessages([
        {
          role: "system",
          content: `You are a chatbot, your primary role is to offer detailed responses and insights related to the content of a specific video. When responding, rely exclusively on the information provided in the video's transcript. Your answers should appear as though they are derived from a comprehensive understanding of the video's subject matter, without explicitly stating or implying that they are based directly on a transcript. Focus your responses on the video's content, avoiding speculation or providing information beyond what is contained in the video. Here's the transcript you'll use to inform your responses: ${videoTranscript.slice(
            0,
            100,
          )}. Do not provide any information that is not from within the video.`,
        },
      ]);
    }
  }, [videoTranscript]);

  const handleInputChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => setInput(e.target.value);

  function formatVideoTranscript(videoTranscript: string) {
    // Split the transcript by "**" (bold markers)
    const parts = videoTranscript.split("**");

    // Map through the parts and wrap every other part in <strong> tags
    return parts.map((part, index) => {
      // Even indices are regular text, odd indices are bold
      if (index % 2 === 0) {
        // Regular text
        return part;
      } else {
        // Text to be bolded
        return <strong key={index}>{part}</strong>;
      }
    });
  }

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    // Assume userMessage is already defined as before
    const userMessage: Message = { role: "user", content: input };
    setInput("");

    // Include the user message in the state before making the API call
    setMessages((currentMessages) => [...currentMessages, userMessage]);

    try {
      // Adjust the payload to include an array of messages
      const payload = {
        messages: [...messages, userMessage], // Assuming 'messages' needs to include the current state messages plus the new user message
      };

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const { aiMessage } = await response.json();
      // Process AI response as before
      setMessages((currentMessages) => [
        ...currentMessages,
        { role: "assistant", content: aiMessage },
      ]);
    } catch (error) {
      console.error("Failed to fetch the AI's response:", error);
    }
  };

  useEffect(() => {
    // Ensure the chat container scrolls to the bottom on each update
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]); // Dependency array ensures this runs every time messages change

  // Function to render a message component
  const renderMessage = (
    message: { role: any; content: any },
    index: React.Key | null | undefined,
  ) => (
    <div
      key={index}
      className={`flex ${
        message.role === "user" ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`rounded-lg px-4 py-2 max-w-md ${
          message.role === "user" ? "bg-blue-500" : "bg-gray-800"
        }`}
      >
        <p className="text-sm text-white">{message.content}</p>
      </div>
    </div>
  );

  return (
    <div className="flex justify-center items-center">
      <Card
        key="1"
        className="w-full max-w-3xl mx-auto shadow-lg rounded-lg flex flex-col"
      >
        <CardHeader className="border-b p-4">
          <div className="grid gap-1.5">
            <CardTitle>Chat with AI Video Summarizer</CardTitle>
            <CardDescription>
              Ask me anything related to your uploaded video!
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col flex-1 overflow-hidden">
          <Tabs defaultValue="conversation" className="flex flex-col flex-1">
            <TabsList className="flex gap-4 border-b">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="conversation">Conversation</TabsTrigger>
            </TabsList>
            {/* Apply consistent styling for both tabs */}
            <div className="flex flex-col flex-1 overflow-hidden">
              <TabsContent
                className="flex-1 overflow-auto text-md"
                value="summary"
              >
                <div className="overflow-auto max-h-[75vh] p-3">
                  {" "}
                  {/* Adjust the max-height as needed */}
                  <h1 className="text-xl text-bold">
                    <b>Title: </b>
                    {videoTitle}
                  </h1>
                  <h1 className="text-xl mt-2 text-bold">
                    <b>Summary:</b>
                  </h1>
                  <p className="mt-1">
                    {formatVideoTranscript(videoTranscript)}
                  </p>
                </div>
              </TabsContent>

              <TabsContent
                className="flex-1 overflow-auto p-4"
                value="conversation"
              >
                <div
                  className="flex flex-col gap-4"
                  style={{ height: "65vh", overflowY: "auto" }}
                  ref={chatContainerRef}
                >
                  {/* Render welcome message as the first item */}
                  {renderMessage(
                    {
                      role: "system",
                      content:
                        "Welcome! Ask me anything related to the video content.",
                    },
                    "welcome",
                  )}
                  {/* Continue rendering other messages */}
                  {messages
                    .filter((message) => message.role !== "system")
                    .map((message, index) => renderMessage(message, index))}
                </div>
                <div className="mt-auto p-4">
                  <form onSubmit={handleSubmit} className="flex gap-4">
                    <Input
                      className="flex-1 mt-2"
                      placeholder="Type a message"
                      value={input}
                      onChange={handleInputChange}
                    />
                    <Button className="mt-2" type="submit">
                      Send
                    </Button>
                  </form>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
