import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Exporting a named function for the POST method
export async function POST(req: Request) {
  const { messages } = await req.json();

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-16k",
      messages: messages,
    });
    console.log("Model:" + response.model);

    const aiMessage = response.choices[0].message.content;

    // Return the AI message in a JSON response
    return new Response(JSON.stringify({ aiMessage }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error }), {
      status: 500,
    });
  }
}
