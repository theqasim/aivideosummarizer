import OpenAI from "openai";
import { TextContentBlock } from "openai/resources/beta/threads/index.mjs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const { transcript } = await req.json();

  let assistant_id = "asst_r6Ryw088h1xCRpw3hlXKwuQ1";

  try {
    let runStatus = "pending";
    let highlightsRunStatus = "pending";

    const assistant = await openai.beta.assistants.retrieve(assistant_id);

    const thread = await openai.beta.threads.create();
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: `Hi, here is the transcript for the YouTube Video, understand it and give me a detailed summary: "${transcript}".`,
    });

    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistant.id,
      instructions: "Do not assume the video is made by the user",
    });

    const runRetrieve = await openai.beta.threads.runs.retrieve(
      thread.id,
      run.id,
    );
    while (runStatus !== "completed") {
      const updatedRun = await openai.beta.threads.runs.retrieve(
        thread.id,
        run.id,
      );
      runStatus = updatedRun.status;

      console.log("Current Summary Run Status:", runStatus);

      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    const messages = await openai.beta.threads.messages.list(thread.id);

    const messagesResponse = await openai.beta.threads.messages.list(thread.id);

    const firstElement = messagesResponse.data[0]
      .content[0] as TextContentBlock;
    const summary = firstElement.text.value;
    const threadId = thread.id;

    // Getting highlights

    const highlightsMessage = await openai.beta.threads.messages.create(
      thread.id,
      {
        role: "user",
        content:
          "Generate a bullet point list of the highlights for the entire video",
      },
    );

    const highlightsRun = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistant.id,
      instructions: "Do not assume the video is made by the user",
    });

    const runRetrieveHighlights = await openai.beta.threads.runs.retrieve(
      threadId,
      run.id,
    );

    while (highlightsRunStatus !== "completed") {
      const highlightsUpdatedRun = await openai.beta.threads.runs.retrieve(
        thread.id,
        highlightsRun.id,
      );

      highlightsRunStatus = highlightsUpdatedRun.status;

      console.log("Current Highlight Run Status:", highlightsRunStatus);
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    const messagesResponseHighlights = await openai.beta.threads.messages.list(
      thread.id,
    );

    const firstElementHighlights = messagesResponseHighlights.data[0]
      .content[0] as TextContentBlock;
    const highlights = firstElementHighlights.text.value;
    return new Response(JSON.stringify({ summary, threadId, highlights }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
