"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import questionsData from "../../data/questions.json";

export default function QuizClient() {
  const router = useRouter();
  const search = useSearchParams();
  const group = search.get("group");

  const groupQuestions = questionsData.filter((q) => q.group === group);
  const totalQuestions = Math.min(10, groupQuestions.length);

  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const shuffled = [...groupQuestions].sort(() => Math.random() - 0.5);
    setQuestions(shuffled.slice(0, totalQuestions));
  }, [group]);

  useEffect(() => {
    if (questions.length === 0 || currentIndex >= questions.length) return;

    const correct = questions[currentIndex]?.answer;
    if (!correct) return;

    const others = groupQuestions
      .filter((q) => q.answer !== correct)
      .sort(() => Math.random() - 0.5)
      .slice(0, 9)
      .map((q) => q.answer);

    setOptions([...others, correct].sort(() => Math.random() - 0.5));
  }, [questions, currentIndex]);

  const handleSelect = (opt: string) => {
    if (selected) return;
    setSelected(opt);
    if (opt === questions[currentIndex].answer) setScore((s) => s + 1);

    setTimeout(() => {
      if (currentIndex + 1 < totalQuestions) {
        setCurrentIndex((i) => i + 1);
        setSelected(null);
      } else {
        const history = JSON.parse(localStorage.getItem("scoreHistory") || "[]");
        history.push({ score, date: new Date().toISOString(), group });
        if (history.length > 20) history.shift();
        localStorage.setItem("scoreHistory", JSON.stringify(history));
        router.push("/result");
      }
    }, 800);
  };

  if (questions.length === 0) {
    return (
      <main style={{ padding: 40 }}>
        <h2>問題が見つかりません</h2>
        <p>グループ「{group}」の問題が存在しないか、データが読み込めていません。</p>
      </main>
    );
  }

  const current = questions[currentIndex];
  if (!current) return <p>読み込み中...</p>;

  return (
    <main style={{ padding: 40 }}>
      <h2>
        {group}クイズ {currentIndex + 1} / {totalQuestions}
      </h2>
      <p style={{ fontSize: "1.2rem", marginBottom: 20 }}>{current.question}</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => handleSelect(opt)}
            style={{
              padding: 10,
              borderRadius: 8,
              background:
                selected === opt
                  ? opt === current.answer
                    ? "#a0e7a0"
                    : "#f7a8a8"
                  : "#eee",
              border: "1px solid #ccc",
            }}
          >
            {opt}
          </button>
        ))}
      </div>

      <p style={{ marginTop: 20 }}>スコア: {score}</p>
    </main>
  );
}
