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
  videoSummary: string;
  threadId: string;
}

interface Message {
  role: "system" | "user" | "assistant"; // Updated to include 'assistant'
  content: string;
}

export default function Chat({
  videoTranscript,
  videoTitle,
  videoSummary,
  threadId,
}: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isAITyping, setIsAITyping] = useState(false);

  const handleInputChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => setInput(e.target.value);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setIsButtonDisabled(true);

    // Assume userMessage is already defined as before
    const userMessage: Message = { role: "user", content: input };
    setInput("");

    // Include the user message in the state before making the API call
    setMessages((currentMessages) => [...currentMessages, userMessage]);
    setIsAITyping(true);

    // Include the user message in the state before making the API call

    try {
      // Adjust the payload to include an array of messages

      const response = await fetch("/api/assistantconversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: input, threadId: threadId }),
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const { assistantResponse } = await response.json();
      // Process AI response as before
      setMessages((currentMessages) => [
        ...currentMessages,
        { role: "assistant", content: assistantResponse },
      ]);
    } catch (error) {
      console.error("Failed to fetch the AI's response:", error);
    }
    setIsAITyping(false);
    setIsButtonDisabled(false);
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

  const renderTypingIndicator = () => (
    <div className="flex justify-start">
      <div className="rounded-lg px-4 py-2 bg-gray-800 max-w-md">
        <p className="text-sm text-white font-bold">AI is typing...</p>
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
              Ask me anything related to the video titled {videoTitle}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col flex-1 overflow-hidden">
          <Tabs defaultValue="conversation" className="flex flex-col flex-1">
            <TabsList className="flex gap-4 border-b">
              <TabsTrigger value="transcript">Transcript</TabsTrigger>
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
                  <p className="mt-1">{videoSummary}</p>
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
                        "Welcome! Ask me anything related to the video titled " +
                        videoTitle,
                    },
                    "welcome",
                  )}
                  {/* Continue rendering other messages */}
                  {messages
                    .filter((message) => message.role !== "system")
                    .map((message, index) => renderMessage(message, index))}
                  {isAITyping && renderTypingIndicator()}
                </div>
                <div className="mt-auto p-4">
                  <form onSubmit={handleSubmit} className="flex gap-4">
                    <Input
                      className="flex-1 mt-2"
                      placeholder="Type a message"
                      value={input}
                      onChange={handleInputChange}
                    />
                    <Button
                      className="mt-2"
                      type="submit"
                      disabled={isButtonDisabled}
                    >
                      Send
                    </Button>
                  </form>
                </div>
              </TabsContent>
              <TabsContent
                className="flex-1 overflow-auto text-md"
                value="transcript"
              >
                <div className="overflow-auto max-h-[75vh] p-3">
                  <h1 className="text-xl mt-2 text-bold">
                    <b>Transcript:</b>
                  </h1>
                  <p className="mt-1">{videoTranscript}</p>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
