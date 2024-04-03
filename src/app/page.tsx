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

// Assuming these icons are already defined elsewhere in your project

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      role: "system",
      content: `As an AI, you have access to a summary of a video's transcript, which outlines the key points and themes discussed in the video. Your task is to use this summary to provide insights and answer questions related to the video's content. Focus on the information contained in the summary and avoid making assumptions or inferences about content not explicitly mentioned. Here is the summary: In 2017, the speaker embarked on a year-long journey to develop an app that, despite the effort, ended up attracting zero users. However, not deterred by past setbacks, they recently pursued a new startup idea, leveraging artificial intelligence to expedite the development process. Within just 3 days, the product, named "Poopup," was created and launched, earning $1,000 in profit within the first 24 hours. "Poopup" is a script for websites that displays popup notifications to enhance website conversion rates by demonstrating empathy towards visitors' pain points. The speaker outlines the product's functionality, explaining how customers can customize and deploy popup notifications on their websites to improve engagement. This project exemplifies several key themes: The entrepreneurial journey's highs and lows, as illustrated by the initial failure and subsequent success. The power of perseverance and resilience, where past failures did not deter the speaker from continuing to innovate. Rapid development and deployment enabled by artificial intelligence, showcasing how AI can significantly reduce development time and facilitate quick market testing. Learning from past experiences, as the idea for "Poopup" was inspired by user feedback from a previous project. The speaker also shares insights on finding startup ideas, emphasizing that ideas come through engagement in various projects, and stresses the importance of starting somewhere to discover real problems that need solving. They highlight the use of AI, particularly GitHub Copilot, in speeding up coding processes and assisting in tasks ranging from coding to content generation. Finally, the speaker shares their unconventional approach to shipping products quickly, such as foregoing TypeScript, Git branches, and testing in the initial stages, to focus on getting the product to market. This journey from concept to launch illustrates not just the application of AI in development but also broader lessons on innovation, adaptation, and the entrepreneurial spirit.`,
    },
  ]);
  const [input, setInput] = useState("");
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // This is where you could load an existing conversation or handle initialization beyond the static system message.
  }, []);

  const handleInputChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => setInput(e.target.value);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const userMessage = { role: "user", content: input };
    setMessages((msgs) => [...msgs, userMessage]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const { aiMessage } = await response.json();
      setMessages((msgs) => [
        ...msgs,
        { role: "assistant", content: aiMessage },
      ]);
    } catch (error) {
      console.error("Failed to fetch the AI's response:", error);
    }

    setInput("");
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
    <div className="flex justify-center items-center h-screen bg-white">
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
        <CardContent className="flex flex-col flex-1">
          <Tabs defaultValue="conversation" className="flex flex-col flex-1">
            <TabsList className="flex gap-4 border-b">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="conversation">Conversation</TabsTrigger>
            </TabsList>
            <TabsContent className="flex-1 overflow-auto p-4" value="summary">
              <h1 className="text-xl text-bold">
                <b>Title: </b>NextJS 14: A Complete Beginners Guide
              </h1>
              <h1 className="text-xl mt-2 text-bold">
                <b>Summary:</b>
              </h1>
              <p className="mt-1">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quos
                cumque ipsam accusantium ex sequi ducimus quas eligendi
                cupiditate officiis consequuntur voluptatibus, natus dolores
                inventore! Quidem tempore nisi veniam maiores quod!
              </p>
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
                    className="flex-1"
                    placeholder="Type a message"
                    value={input}
                    onChange={handleInputChange}
                  />
                  <Button type="submit">Send</Button>
                </form>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
