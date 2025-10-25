import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "questions.json");

export async function GET() {
  const data = fs.readFileSync(filePath, "utf-8");
  const questions = JSON.parse(data);
  return NextResponse.json(questions);
}

export async function POST(req: Request) {
  const newQuestion = await req.json();
  const data = fs.readFileSync(filePath, "utf-8");
  const questions = JSON.parse(data);
  questions.push(newQuestion);
  fs.writeFileSync(filePath, JSON.stringify(questions, null, 2));
  return NextResponse.json({ message: "追加しました", question: newQuestion });
}

export async function PUT(req: Request) {
  const updated = await req.json();
  fs.writeFileSync(filePath, JSON.stringify(updated, null, 2));
  return NextResponse.json({ message: "更新しました" });
}
