import { Suspense } from "react";
import QuizClient from "./QuizClient";

export default function QuizPage() {
  return (
    <Suspense fallback={<div>読み込み中...</div>}>
      <QuizClient />
    </Suspense>
  );
}
