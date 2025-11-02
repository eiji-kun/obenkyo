"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import questionsData from "../../data/questions.json";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

export default function ResultPage() {
  const router = useRouter();
  const [history, setHistory] = useState<any[]>([]);
  const groups = useMemo(() => Array.from(new Set(questionsData.map((q) => q.group))), []);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(groups[0] || null);
  const [filterFlip, setFilterFlip] = useState<boolean>(() => {
    try {
      const v = localStorage.getItem("quiz_flipped");
      return v === "1";
    } catch (e) {
      return false;
    }
  });

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("scoreHistory") || "[]");
    setHistory(data);
  }, []);

  // filter history by selected group + flip flag
  const filtered = history
    .filter((h) => {
      if (!selectedGroup) return false;
      const hflip = typeof h.flip === "boolean" ? h.flip : false; // legacy entries default to false
      return h.group === selectedGroup && hflip === filterFlip;
    })
    .map((h) => ({ date: new Date(h.date).toLocaleString(), score: h.score }));

  return (
    <main style={{ padding: 40 }}>
      <h2>🎉 結果 🎉</h2>
      <button onClick={() => router.push("/")} style={{ marginBottom: 20 }}>
        トップに戻る
      </button>

      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
        <label>
          グループ:
          <select value={selectedGroup || ""} onChange={(e) => setSelectedGroup(e.target.value)} style={{ marginLeft: 8 }}>
            {groups.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </label>

        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input type="checkbox" checked={filterFlip} onChange={() => setFilterFlip((v) => !v)} />
          <span>解答を出題にするモードのみ表示</span>
        </label>
      </div>

      {filtered.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={filtered}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 10]} />
            <Tooltip />
            <Line type="monotone" dataKey="score" stroke="#0070f3" />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p>選択したグループとモードに該当するスコア履歴がありません。</p>
      )}
    </main>
  );
}
