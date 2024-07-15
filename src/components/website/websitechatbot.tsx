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

interface ChatProps {
  videoTitle: string;
  videoSummary: string;
  threadId: string;
  chatbotAssistantID: string;
}

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

export default function WebsiteChat({
  videoTitle,
  videoSummary,
  threadId,
  chatbotAssistantID,
}: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isAITyping, setIsAITyping] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);

    setIsButtonDisabled(value.trim() === "");
  };
  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setIsButtonDisabled(true);
    const userMessage: Message = { role: "user", content: input };
    setInput("");
    setMessages((currentMessages) => [...currentMessages, userMessage]);
    console.log("input", input);
    setIsAITyping(true);

    console.log(threadId, chatbotAssistantID);
    try {
      const response = await fetch("/api/assistantconversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: input,
          threadId: threadId,
          chatbotAssistantID: chatbotAssistantID,
        }),
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const { assistantResponse } = await response.json();
      setMessages((currentMessages) => [
        ...currentMessages,
        { role: "assistant", content: assistantResponse },
      ]);
    } catch (error) {
      return error;
    }
    setIsAITyping(false);
    setIsButtonDisabled(false);
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

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
        <p className="text-sm text-white font-bold">AI Chatbot is typing...</p>
      </div>
    </div>
  );

  return (
    <div className="flex justify-center items-center ">
      <Card
        key="1"
        className="w-full max-w-3xl mx-auto shadow-lg rounded-lg flex flex-col   "
      >
        <CardHeader className="border-b-2 p-4">
          <div className="grid gap-1.5">
            <CardTitle>Text Insights Now Available!</CardTitle>
            <CardDescription>
              All the insights present here are based on the text you&apos;ve
              entered
              <b className="font-bold text-red-500"> {videoTitle}</b>
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col flex-1 overflow-hidden">
          <Tabs defaultValue="conversation" className="flex flex-col flex-1">
            <TabsList className="flex gap-4 border-b-2">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="conversation">Chatbot</TabsTrigger>
            </TabsList>
            <div className="flex flex-col flex-1 overflow-hidden">
              <TabsContent
                className="flex-1 overflow-auto text-md"
                value="summary"
              >
                <div className="overflow-auto max-h-[75vh] p-3">
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
                  {renderMessage(
                    {
                      role: "system",
                      content:
                        "Welcome! Ask me anything related to the text you've entered",
                    },
                    "welcome",
                  )}
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
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
