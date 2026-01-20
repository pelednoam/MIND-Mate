import { NextResponse } from "next/server";
import { runOptionDuel, type OptionDuelRequest } from "@/lib/optionDuelApi";

export async function POST(request: Request) {
  let body: OptionDuelRequest;
  try {
    body = (await request.json()) as OptionDuelRequest;
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const decision = runOptionDuel(body);
    return NextResponse.json({ decision });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Invalid option duel request";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
