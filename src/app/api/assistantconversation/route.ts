import OpenAI from "openai";
import { TextContentBlock } from "openai/resources/beta/threads/index.mjs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Assuming you've correctly defined Message and ApiResponse elsewhere

export async function POST(req: Request) {
  const { input, threadId } = await req.json();

  let assistant_id = "asst_r6Ryw088h1xCRpw3hlXKwuQ1";

  try {
    let runStatus = "pending";

    const assistant = await openai.beta.assistants.retrieve(assistant_id);

    console.log(assistant);

    //const thread = await openai.beta.threads.create();
    //console.log(thread);
    await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: input,
    });

    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: assistant.id,
      instructions: "Do not assume the video is made by the user",
    });

    const runRetrieve = await openai.beta.threads.runs.retrieve(
      threadId,
      run.id,
    );

    console.log("Run Retrieved:" + runRetrieve.status);

    // Use a loop to continuously check the status
    while (runStatus !== "completed") {
      // Retrieve the run's status again to see if it has changed
      const updatedRun = await openai.beta.threads.runs.retrieve(
        threadId,
        run.id,
      );

      // Update the runStatus with the latest status from the updated run
      runStatus = updatedRun.status;

      console.log("Current Run Status:", runStatus);

      // Wait for a short period before checking again to avoid hitting rate limits
      // This waits for 2 seconds before the next check
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    const messages = await openai.beta.threads.messages.list(threadId);

    // console.log(messages);

    const messagesResponse = await openai.beta.threads.messages.list(threadId);

    const firstElement = messagesResponse.data[0]
      .content[0] as TextContentBlock;
    const assistantResponse = firstElement.text.value;
    console.log(assistantResponse);
    console.log("Conversation Thread ID:" + threadId);

    // Return the AI message in a JSON response
    return new Response(JSON.stringify({ assistantResponse }), {
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
