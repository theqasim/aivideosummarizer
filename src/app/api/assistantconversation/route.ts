import OpenAI from "openai";
import { TextContentBlock } from "openai/resources/beta/threads/index.mjs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const { input, threadId } = await req.json();

  let assistant_id = "asst_r6Ryw088h1xCRpw3hlXKwuQ1";

  try {
    let runStatus = "pending";

    const assistant = await openai.beta.assistants.retrieve(assistant_id);

    await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: input,
    });

    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: assistant.id,
      instructions:
        "Do not assume the video is made by the user, and do not mention you're getting the insights from the transcript. ",
    });

    const runRetrieve = await openai.beta.threads.runs.retrieve(
      threadId,
      run.id,
    );
    while (runStatus !== "completed") {
      const updatedRun = await openai.beta.threads.runs.retrieve(
        threadId,
        run.id,
      );
      runStatus = updatedRun.status;

      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    const messages = await openai.beta.threads.messages.list(threadId);

    const messagesResponse = await openai.beta.threads.messages.list(threadId);

    const firstElement = messagesResponse.data[0]
      .content[0] as TextContentBlock;
    const assistantResponse = firstElement.text.value;
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
