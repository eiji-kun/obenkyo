"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import questionsData from "../data/questions.json";

export default function HomePage() {
  const router = useRouter();
  const groups = Array.from(new Set(questionsData.map((q) => q.group)));
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    try {
      const v = localStorage.getItem("quiz_flipped");
      if (v !== null) setFlipped(v === "1");
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("quiz_flipped", flipped ? "1" : "0");
    } catch (e) {
      // ignore
    }
  }, [flipped]);

  return (
    <main style={{ padding: 40 }}>
      <h1>🧩 クイズアプリ</h1>

      <div style={{ marginTop: 12, marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input type="checkbox" checked={flipped} onChange={() => setFlipped((v) => !v)} />
          <span>解答を出題にする (問題/選択肢を入れ替え)</span>
        </label>
      </div>

      <p>グループを選んでください：</p>
      <div style={{ display: "flex", gap: 16, marginTop: 20, flexWrap: "wrap" }}>
        {groups.map((group) => (
          <button
            key={group}
            onClick={() => router.push(`/quiz?group=${encodeURIComponent(group)}&flip=${flipped ? "1" : "0"}`)}
            style={{
              padding: "10px 20px",
              borderRadius: 8,
              background: "#0070f3",
              color: "white",
              marginBottom: 12
            }}
          >
            {group}
          </button>
        ))}
        <button
          onClick={() => router.push(`/quiz/homophones`)}
          style={{
            padding: "10px 20px",
            borderRadius: 8,
            background: "#0070f3",
            color: "white",
            marginLeft: 32
          }}
        >
          同音異義語
        </button>
      </div>
      <button
        onClick={() => router.push("/admin")}
        style={{ marginTop: 40, background: "#666", color: "white", padding: 8 }}
      >
        管理画面へ
      </button>
    </main>
  );
}
