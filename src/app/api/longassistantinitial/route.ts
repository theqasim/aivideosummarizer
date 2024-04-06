import OpenAI from "openai";
import { TextContentBlock } from "openai/resources/beta/threads/index.mjs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Function to split the transcript into parts
function splitTranscript(transcript: string, maxPartSize: number) {
  const parts = [];
  let currentPart = "";

  transcript.split(/\s+/).forEach((word) => {
    if (currentPart.length + word.length + 1 > maxPartSize) {
      parts.push(currentPart);
      currentPart = word;
    } else {
      currentPart += (currentPart.length > 0 ? " " : "") + word;
    }
  });

  if (currentPart) {
    parts.push(currentPart);
  }

  return parts;
}

export async function POST(req: Request) {
  const { transcript } = await req.json();
  const transcriptParts = splitTranscript(transcript, 32000);

  let assistant_id = "asst_r6Ryw088h1xCRpw3hlXKwuQ1";
  let summary = "";

  try {
    const assistant = await openai.beta.assistants.retrieve(assistant_id);
    const thread = await openai.beta.threads.create();

    for (let i = 0; i < transcriptParts.length; i++) {
      const content = `This is part ${i + 1} of the transcript: "${
        transcriptParts[i]
      }"`;
      await openai.beta.threads.messages.create(thread.id, {
        role: "user",
        content: content,
      });

      // If it's the last part, instruct the assistant to give a detailed summary
      if (i === transcriptParts.length - 1) {
        await openai.beta.threads.messages.create(thread.id, {
          role: "user",
          content:
            "This is the last part of the transcript. Please provide a full breakdown of the entire video missing no details based on all the transcripts provided.",
        });
      }
    }

    // Wait for the completion of the run
    let runStatus = "pending";
    let run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistant.id,
      instructions: "Do not assume the video is made by the user",
    });

    while (runStatus !== "completed") {
      const updatedRun = await openai.beta.threads.runs.retrieve(
        thread.id,
        run.id,
      );
      runStatus = updatedRun.status;
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    const messagesResponse = await openai.beta.threads.messages.list(thread.id);

    const firstElement = messagesResponse.data[0]
      .content[0] as TextContentBlock;
    const summary = firstElement.text.value;

    console.log(summary);

    return new Response(JSON.stringify({ summary, threadId: thread.id }), {
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