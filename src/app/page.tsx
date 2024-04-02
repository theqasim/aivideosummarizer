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
      content:
        "As an AI, your primary role is to offer detailed responses and insights related to the content of a specific video. When responding, rely exclusively on the information provided in the video's transcript. Your answers should appear as though they are derived from a comprehensive understanding of the video's subject matter, without explicitly stating or implying that they are based directly on a transcript. Focus your responses on the video's content, avoiding speculation or providing information beyond what is contained in the video. Here's the transcript you'll use to inform your responses: In this video, I will show you how to create viral TikToks so you can make money through the TikTok creativity program. The content I will show you how to make in this video is classed as original content so you can actually monetize the content. Making money on TikTok has never been easier, and trust me, you do not want to miss out on this because people are making thousands of dollars a month. By the end of this video, you will have the skills to do the same by using the new and unique niche I will show you in this video. So if you're excited, drop a like on today's video, subscribe to the channel. I have a ton of content on my channel teaching you how to make money online. It's very important to keep in mind that the people that watch this video are going to copy the exact strategy I mentioned, so you need to put a spin on the content, and I will show you how to do that as well. And make sure you watch till the end of the video where I show you the exact strategy you can use to take your TikTok account from 0 to 10,000 followers super easily. The type of content we'll be making is nostalgia videos, and they are bringing in millions of views on a daily basis. That means people are making thousands just from posting TikToks. Now you might be asking yourself why is this content doing so well. Very simply, the concept of the content is to show old media whether that's from 2016 or the early 2000s, but the key is to show popular media in those times in a TikTok video, and because it triggers memories in the viewers' minds, that makes it nostalgic and that brings in millions of views. The best part is the content is super easy to make, and you're actively leveraging the memories of the viewers so they watch the video, engage with the content, and your videos go viral. If you're not convinced that this content will do well for you despite me showing you active examples of pages bringing in millions of views, or you feel like this niche isn't too sustainable, you have to realize there's hundreds of millions of people that have consumed a wide variety of media over the last few decades, and you can use that in your TikTok videos to tap into their memories, make the content seem nostalgic, so you can bring in millions of views. So let's jump into how to create this content, and like I said, this content is super easy to make, but we need to make sure we're optimizing for the AVD. Now AVD stands for average view duration, and the reason why we're optimizing for this is because the longer the AVD is, that validates the TikTok to the TikTok algorithm that pushes the video, that increases the views and engagement, and then the video will go viral, and you will make a lot of money, which is why we're going to adopt the approach of taking clips of media that is highly loved by their fanbases and making sure TikToks are above one minute long so we can actually monetize the content. The first element we need for our videos is to find media that the viewer will find nostalgic. Now this can literally be any form of media; it could be video games, it could be TV shows. For the sake of this video, we'll go with video games, and we'll specifically choose Call of Duty for the topic of the video. Now one thing to keep in mind is that when you're choosing media, you need to make sure it's super distinct. Now the reason why I choose Call of Duty is because when I show the viewer a video, they'll be able to easily tell which Call of Duty this is. However, if I chose something like FIFA, all the games look exactly the same, so the media is not going to hit the same, and the video is not going to go viral. So make sure your media is distinct. Now we need to find good-looking videos to use in our TikToks. Now for the video game example, I'm going to go with Black Ops 3, so I would search something like Black Ops 3 gameplay, find a good-looking video, copy the YouTube video URL, go to a YouTube to MP4 downloader, and download the video so we can use it in our TikToks. Now we need to find an audio to use in our TikToks. Now the key here is to use an audio that triggers emotions in the viewer because we're trying to get the viewer to dive back into their memories so they can actually resonate with the video and trigger nostalgia within them so they can watch the video for a long duration, that increases the AVD, and the video will go viral. So with that in mind, this audio snippet I'm about to show you is probably one of the best out there, and I'll also leave it linked down below if you want to use it in your TikTok videos. Once you have these two elements, the next step is to put some text on the screen to prompt the viewer to view the TikTok from the POV of nostalgia so we can trigger some emotions; they can start recalling memories so they can actually engage with the content. Now, a lot of these pages use the text of 'wake up bro, it's 2018' or whatever year the media is from, and that's a great way to get the viewer to understand that this is nostalgic content. Now once you combine all these elements together, you'll get a video like this. These videos are super easy to make, and they're bringing in millions of views, and you can literally do this with any type of old nostalgic content as long as that content has a loving fan base because that fan base is going to return and actually engage with your TikToks. Now, as promised, I'm going to show you how to take your TikTok account from 0 to 10,000 followers, and I've actually recorded an exclusive video that breaks down exactly how to do this, so you can actually join the TikTok creativity program super easily. Now you can get access to this video within Webwolf; this is my free Discord group that teaches you how to make money online. There's tons of in-depth lesson resources in there, and in that video content, all guided at teaching you how to make money online, and you can get access to this by clicking the top link in the description. It's completely free, once again, and I will see you in there",
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
    index: React.Key | null | undefined
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
                  "welcome"
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
