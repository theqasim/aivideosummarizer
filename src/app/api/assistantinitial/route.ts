import OpenAI from "openai";
import { TextContentBlock } from "openai/resources/beta/threads/index.mjs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Assuming you've correctly defined Message and ApiResponse elsewhere

export async function POST(req: Request) {
  const { transcript } = await req.json();

  let assistant_id = "asst_r6Ryw088h1xCRpw3hlXKwuQ1";

  try {
    let runStatus = "pending";
    let highlightsRunStatus = "pending";

    const assistant = await openai.beta.assistants.retrieve(assistant_id);

    console.log(assistant);

    const thread = await openai.beta.threads.create();
    //console.log(thread);
    console.log("Transcript:" + transcript);
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

    console.log("Run Retrieved:" + runRetrieve.status);

    // Use a loop to continuously check the status
    while (runStatus !== "completed") {
      // Retrieve the run's status again to see if it has changed
      const updatedRun = await openai.beta.threads.runs.retrieve(
        thread.id,
        run.id,
      );

      // Update the runStatus with the latest status from the updated run
      runStatus = updatedRun.status;

      console.log("Current Summary Run Status:", runStatus);

      // Wait for a short period before checking again to avoid hitting rate limits
      // This waits for 2 seconds before the next check
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    const messages = await openai.beta.threads.messages.list(thread.id);

    // console.log(messages);

    const messagesResponse = await openai.beta.threads.messages.list(thread.id);

    const firstElement = messagesResponse.data[0]
      .content[0] as TextContentBlock;
    const summary = firstElement.text.value;
    const threadId = thread.id;
    console.log(summary);
    console.log("Initial Thread ID:" + threadId);

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

    console.log("got here");
    const runRetrieveHighlights = await openai.beta.threads.runs.retrieve(
      threadId,
      run.id,
    );

    console.log("got here too");

    console.log("Run Retrieved:" + runRetrieveHighlights.status);

    // Use a loop to continuously check the status
    while (highlightsRunStatus !== "completed") {
      // Retrieve the run's status again to see if it has changed
      const highlightsUpdatedRun = await openai.beta.threads.runs.retrieve(
        thread.id,
        highlightsRun.id,
      );

      // Update the runStatus with the latest status from the updated run
      highlightsRunStatus = highlightsUpdatedRun.status;

      console.log("Current Highlight Run Status:", highlightsRunStatus);

      // Wait for a short period before checking again to avoid hitting rate limits
      // This waits for 2 seconds before the next check
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    // console.log(messages);

    const messagesResponseHighlights = await openai.beta.threads.messages.list(
      thread.id,
    );

    const firstElementHighlights = messagesResponseHighlights.data[0]
      .content[0] as TextContentBlock;
    const highlights = firstElementHighlights.text.value;
    console.log(highlights);
    console.log("Conversation Thread ID:" + threadId);

    // Return the AI message in a JSON response
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
