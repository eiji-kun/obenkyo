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
    const [flipped, setFlipped] = useState(() => search.get("flip") === "1"); // initialize from URL param if provided
    const [selected, setSelected] = useState<string | null>(null);
    const [score, setScore] = useState(0);

    useEffect(() => {
        const shuffled = [...groupQuestions].sort(() => Math.random() - 0.5);
        setQuestions(shuffled.slice(0, totalQuestions));
    }, [group]);

    useEffect(() => {
        if (questions.length === 0 || currentIndex >= questions.length) return;
        // When flipped is false: prompt = question, options = answers
        // When flipped is true: prompt = answer, options = questions
        const correct = flipped ? questions[currentIndex]?.question : questions[currentIndex]?.answer;
        if (!correct) return;

        const others = groupQuestions
            .filter((q) => (flipped ? q.question !== correct : q.answer !== correct))
            .sort(() => Math.random() - 0.5)
            .slice(0, 9)
            .map((q) => (flipped ? q.question : q.answer));

        setOptions([...others, correct].sort(() => Math.random() - 0.5));
    }, [questions, currentIndex, flipped]);

    // Regenerate options when flip mode changes so options match the mode
    useEffect(() => {
        // reset selection and options when flip toggles
        setSelected(null);
        setOptions([]);
        // trigger the options generation effect by nudging currentIndex (or rely on effect dependencies)
    }, [flipped]);

    const handleSelect = (opt: string) => {
        if (selected) return;
        setSelected(opt);
        const correctValue = flipped ? questions[currentIndex].question : questions[currentIndex].answer;
        if (opt === correctValue) setScore((s) => s + 1);

        setTimeout(() => {
            if (currentIndex + 1 < totalQuestions) {
                setCurrentIndex((i) => i + 1);
                setSelected(null);
                } else {
                    const history = JSON.parse(localStorage.getItem("scoreHistory") || "[]");
                    // store flip flag so results can be filtered by mode
                    history.push({ score, date: new Date().toISOString(), group, flip: Boolean(flipped) });
                    if (history.length > 200) history.shift();
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

    const correctValue = flipped ? current.question : current.answer;

    return (
        <main style={{ padding: 40 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <input
                        type="checkbox"
                        checked={flipped}
                        // quiz page shouldn't allow changing flip (must be chosen on top page)
                        disabled
                        readOnly
                    />
                    <span style={{ fontSize: "0.9rem" }}>解答を出題にする (問題/選択肢を入れ替え)</span>
                </label>
            </div>
            <h2>
                {group}クイズ {currentIndex + 1} / {totalQuestions}
            </h2>
            <p style={{ fontSize: "1.2rem", marginBottom: 20 }}>
                {flipped ? current.answer : current.question}
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {options.map((opt) => (
                    <button
                        key={opt}
                        onClick={() => handleSelect(opt)}
                        style={{
                            padding: 10,
                            borderRadius: 8,
                            appearance: "none",
                            WebkitAppearance: "none",
                            background:
                                selected === opt
                                    ? opt === correctValue
                                        ? "#a0e7a0"
                                        : "#f7a8a8"
                                    : "#eee",
                            color: "#000",
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
