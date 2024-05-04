import OpenAI from "openai";
import { TextContentBlock } from "openai/resources/beta/threads/index.mjs";
export const maxDuration = 300;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { input, threadId, chatbotAssistantID } = await req.json();

    let assistant_id = chatbotAssistantID;
    let assistantResponse = "";
    let assistant, run, runStatus, runRetrieve, messagesResponse;

    try {
      assistant = await openai.beta.assistants.retrieve(assistant_id);
    } catch (error) {
      return new Response(
        JSON.stringify({ error: "Error retrieving assistant" }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    try {
      await openai.beta.threads.messages.create(threadId, {
        role: "user",
        content: input,
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: "Error creating message" }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    try {
      run = await openai.beta.threads.runs.create(threadId, {
        assistant_id: assistant.id,
        instructions:
          "Do not assume the video is made by the user, and do not mention you're getting the insights from the transcript.",
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: "Error creating run" }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    try {
      runStatus = "pending";

      while (runStatus !== "completed") {
        runRetrieve = await openai.beta.threads.runs.retrieve(threadId, run.id);
        runStatus = runRetrieve.status;
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    } catch (error) {
      return new Response(
        JSON.stringify({ error: "Error retrieving run status" }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    try {
      messagesResponse = await openai.beta.threads.messages.list(threadId);
      const firstElement = messagesResponse.data[0]
        .content[0] as TextContentBlock;
      assistantResponse = firstElement.text.value;
    } catch (error) {
      return new Response(
        JSON.stringify({ error: "Error retrieving messages" }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    return new Response(JSON.stringify({ assistantResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Unexpected error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
