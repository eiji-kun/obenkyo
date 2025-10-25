"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

export default function ResultPage() {
  const router = useRouter();
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("scoreHistory") || "[]");
    setHistory(data);
  }, []);

  return (
    <main style={{ padding: 40 }}>
      <h2>🎉 結果 🎉</h2>
      <button onClick={() => router.push("/")} style={{ marginBottom: 20 }}>
        トップに戻る
      </button>

      {history.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={history}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" hide />
            <YAxis domain={[0, 10]} />
            <Tooltip />
            <Line type="monotone" dataKey="score" stroke="#0070f3" />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p>まだスコア履歴がありません。</p>
      )}
    </main>
  );
}
