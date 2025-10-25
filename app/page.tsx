"use client";

import { useRouter } from "next/navigation";
import questionsData from "../data/questions.json";

export default function HomePage() {
  const router = useRouter();
  const groups = Array.from(new Set(questionsData.map((q) => q.group)));

  return (
    <main style={{ padding: 40 }}>
      <h1>🧩 クイズアプリ</h1>
      <p>グループを選んでください：</p>
      <div style={{ display: "flex", gap: 16, marginTop: 20 }}>
        {groups.map((group) => (
          <button
            key={group}
            onClick={() => router.push(`/quiz?group=${group}`)}
            style={{
              padding: "10px 20px",
              borderRadius: 8,
              background: "#0070f3",
              color: "white",
            }}
          >
            {group}
          </button>
        ))}
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
