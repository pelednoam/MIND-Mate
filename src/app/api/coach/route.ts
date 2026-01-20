import { NextResponse } from "next/server";
import { generateCoachResponse } from "@/lib/coachResponder";
import type { CoachPrompt } from "@/lib/coachPrompt";

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

  const reply = generateCoachResponse(body.prompt);
  return NextResponse.json({ reply });
}
