import { Content } from "next/font/google";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const SystemPrompt = "Hello welcome to the AI Flashcards"

//Create API Key:

export const POST = async (req) => {
    const openai = OpenAI()
    const data = req.text()

    const completion = await openai.chat.completions.create({
        messages: [{ role: 'system', content: SystemPrompt },
        { role: 'user', content: data }],
        model: 'gpt-4o',
        //makes sure the format is always in a json format
        response_format: (typeof (JSON))
    })

    //
    const flashcards = JSON.parse(completion.choices[0].message.content)
    return NextResponse.json(flashcards.flashcard)
}
