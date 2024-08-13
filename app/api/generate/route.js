import { NextResponse } from "next/server";
import OpenAI from "openai";

const SystemPrompt = "Hello welcome to the AI Flashcards";

// Create API Key:
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY 
});

export const POST = async (req) => {
  try {
    const data = await req.text();
    console.log("Received request data:", data); // Debug logging

    const completion = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: SystemPrompt },
        { role: 'user', content: data }
      ],
      model: 'gpt-4'
    });

    console.log("Completion result:", completion); // Debug logging

    // Log the content of the message
    const messageContent = completion.choices[0].message.content;
    console.log("Message content:", messageContent);

    // Parse the plain text response to extract flashcards
    const flashcards = messageContent.split('\n\n').reduce((acc, card) => {
      const [questionLine, answerLine] = card.split('\n');
      if (questionLine && answerLine) {
        acc.push({
          front: questionLine.replace('Q: ', '').trim() + '?',
          back: answerLine.replace('A: ', '').trim().replace(/\*\*/g, '')
        });
      }
      return acc;
    }, []);

    return NextResponse.json({ flashcards });
  } catch (error) {
    console.error("Error generating flashcards:", error); // Debug logging
    return NextResponse.json({ error: error.message });
  }
};
