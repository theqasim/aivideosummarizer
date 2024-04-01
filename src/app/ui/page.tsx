import React, { useState, useEffect } from "react";
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
import { JSX, SVGProps } from "react";

export default function Component() {
  return (
    <div className="flex justify-center items-center h-screen bg-white">
      {" "}
      {/* Centering the card */}
      <Card key="1" className="w-full max-w-3xl mx-auto shadow-lg rounded-lg">
        {" "}
        {/* Shadow and rounded corners added */}
        <CardHeader className="border-b p-4">
          {" "}
          {/* Padding added */}
          <div className="grid gap-1.5">
            <CardTitle>Chat with AI Video Summarizer</CardTitle>
            <CardDescription>
              Ask me anything related to your uploaded video!
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          {" "}
          {/* Padding added to content */}
          <Tabs defaultValue="summary">
            <TabsList className="flex gap-4 border-b">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="conversation">Conversation</TabsTrigger>
            </TabsList>
            <TabsContent className="p-0" value="summary">
              <div className="p-4 grid gap-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">About AcmeBot</h3>
                  <p className="text-sm leading-loose md:text-base/relaxed lg:text-base/relaxed xl:text-base/relaxed">
                    AcmeBot is an AI-powered chatbot designed to assist you with
                    a variety of tasks. Whether you have questions about our
                    products, need help troubleshooting an issue, or want to
                    learn more about our services, AcmeBot is here to help.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Features</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm leading-loose md:text-base xl:text-base">
                    <li>24/7 availability</li>
                    <li>Instant responses</li>
                    <li>Support for multiple languages</li>
                    <li>Integration with knowledge base</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            <TabsContent className="p-0" value="conversation">
              <div className="p-4 border-t">
                <div className="grid gap-2">
                  <div className="flex gap-2 items-start">
                    <img
                      alt="Avatar"
                      className="rounded-full overflow-hidden object-cover"
                      height="40"
                      src="/placeholder.svg"
                      style={{
                        aspectRatio: "40/40",
                        objectFit: "cover",
                      }}
                      width="40"
                    />
                    <div className="bg-gray-100 rounded-lg px-4 py-3 text-sm dark:bg-gray-800">
                      Hi there! How can I assist you today?
                    </div>
                  </div>
                  <div className="flex gap-2 items-start flex-row-reverse">
                    <img
                      alt="Avatar"
                      className="rounded-full overflow-hidden object-cover"
                      height="40"
                      src="/placeholder.svg"
                      style={{
                        aspectRatio: "40/40",
                        objectFit: "cover",
                      }}
                      width="40"
                    />
                    <div className="bg-gray-100 rounded-lg px-4 py-3 text-sm dark:bg-gray-800">
                      I'm having trouble accessing my account. Can you help me
                      reset my password?
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 border-t">
                <div className="flex items-center gap-4">
                  <PaperclipIcon className="w-4 h-4 opacity-50 hover:cursor-pointer" />
                  <MicIcon className="w-4 h-4 opacity-50" />
                  <SmileIcon className="w-4 h-4 opacity-50" />
                  <Input
                    className="flex-1 min-w-0"
                    placeholder="Type a message"
                    type="text"
                  />
                  <Button type="submit">Send</Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function MicIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" x2="12" y1="19" y2="22" />
    </svg>
  );
}

function PaperclipIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>,
) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  );
}

function SmileIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <line x1="9" x2="9.01" y1="9" y2="9" />
      <line x1="15" x2="15.01" y1="9" y2="9" />
    </svg>
  );
}
