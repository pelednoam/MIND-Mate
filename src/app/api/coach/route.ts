import { NextResponse } from "next/server";
import { generateText } from "ai";
import type { CoachPrompt } from "@/lib/coachPrompt";
import { getCoachModel } from "@/lib/llm/llmClient";

type CoachRequestBody = {
  prompt: CoachPrompt;
};

export async function POST(request: Request) {
  let body: CoachRequestBody;
  try {
    body = (await request.json()) as CoachRequestBody;
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.prompt || !body.prompt.user || !body.prompt.system) {
    return NextResponse.json(
      { error: "Missing prompt payload" },
      { status: 400 }
    );
  }

  try {
    const result = await generateText({
      model: getCoachModel(),
      system: body.prompt.system,
      prompt: body.prompt.user
    });
    return NextResponse.json({ reply: result.text });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "LLM request failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
