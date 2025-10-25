"use client";

import { useEffect, useState } from "react";

type Question = {
  group: string;
  question: string;
  answer: string;
};

export default function AdminPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQ, setNewQ] = useState<Question>({ group: "", question: "", answer: "" });

  // 初回ロード時にAPIからデータ取得
  useEffect(() => {
    fetch("/api/questions")
      .then((res) => res.json())
      .then(setQuestions);
  }, []);

  const addQuestion = async () => {
    if (!newQ.group || !newQ.question || !newQ.answer) return alert("全て入力してください");
    await fetch("/api/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newQ),
    });
    setNewQ({ group: "", question: "", answer: "" });
    const updated = await fetch("/api/questions").then((res) => res.json());
    setQuestions(updated);
  };

  const saveAll = async () => {
    await fetch("/api/questions", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(questions),
    });
    alert("保存しました");
  };

  const deleteQuestion = (index: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <main style={{ padding: 40 }}>
      <h1>⚙️ 管理画面</h1>

      <h3>新しい問題を追加</h3>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          placeholder="グループ"
          value={newQ.group}
          onChange={(e) => setNewQ({ ...newQ, group: e.target.value })}
        />
        <input
          placeholder="問題"
          value={newQ.question}
          onChange={(e) => setNewQ({ ...newQ, question: e.target.value })}
        />
        <input
          placeholder="答え"
          value={newQ.answer}
          onChange={(e) => setNewQ({ ...newQ, answer: e.target.value })}
        />
        <button onClick={addQuestion}>追加</button>
      </div>

      <h3 style={{ marginTop: 30 }}>問題リスト（{questions.length}件）</h3>
      {questions.map((q, i) => (
        <div key={i} style={{ marginBottom: 8 }}>
          <b>[{q.group}]</b> {q.question} → {q.answer}
          <button onClick={() => deleteQuestion(i)} style={{ marginLeft: 8 }}>
            削除
          </button>
        </div>
      ))}

      <button
        onClick={saveAll}
        style={{
          marginTop: 20,
          background: "#0070f3",
          color: "white",
          padding: "8px 16px",
          borderRadius: 8,
        }}
      >
        すべて保存
      </button>
    </main>
  );
}
