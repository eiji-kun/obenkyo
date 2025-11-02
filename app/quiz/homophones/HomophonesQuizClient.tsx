"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import homophones from "../../../data/do-on_ighigo.json";

// Group entries by yomi
const homophoneGroups = homophones.reduce((acc, entry) => {
    if (!acc[entry.yomi]) {
        acc[entry.yomi] = [];
    }
    acc[entry.yomi].push(entry);
    return acc;
}, {} as Record<string, typeof homophones>);

const yomiList = Object.keys(homophoneGroups);

interface Question {
    yomi: string;
    sample: string;
    choices: { word: string; yomi: string }[];
    correctWord: string;
}

export default function HomophonesQuizClient() {
    const router = useRouter();
    const totalQuestions = 10;

    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selected, setSelected] = useState<string | null>(null);
    const [score, setScore] = useState(0);

    // Generate questions on mount
    useEffect(() => {
        // Shuffle yomi list and take first 10
        const shuffledYomi = [...yomiList].sort(() => Math.random() - 0.5).slice(0, totalQuestions);
        
        const generatedQuestions = shuffledYomi.map(yomi => {
            const entries = homophoneGroups[yomi];
            // Randomly select one entry and one of its samples
            const randomEntry = entries[Math.floor(Math.random() * entries.length)];
            const randomSample = randomEntry.samples[Math.floor(Math.random() * randomEntry.samples.length)];
            
            // Create a question where word is masked in the sample
            const maskedSample = randomSample.replace(new RegExp(randomEntry.word, "g"), "【　】");
            
            // Get all words with the same yomi as choices
            const choices = entries.map(entry => ({
                word: entry.word,
                yomi: entry.yomi
            }));
            
            return {
                yomi: randomEntry.yomi,
                sample: maskedSample,
                choices,
                correctWord: randomEntry.word
            };
        });

        setQuestions(generatedQuestions);
    }, []);

    const handleSelect = (selectedWord: string) => {
        if (selected) return;
        setSelected(selectedWord);
        if (selectedWord === questions[currentIndex].correctWord) {
            setScore(s => s + 1);
        }

        setTimeout(() => {
            if (currentIndex + 1 < totalQuestions) {
                setCurrentIndex(i => i + 1);
                setSelected(null);
            } else {
                const history = JSON.parse(localStorage.getItem("scoreHistory") || "[]");
                history.push({
                    score,
                    date: new Date().toISOString(),
                    type: "homophones",
                    group: "homophones"
                });
                localStorage.setItem("scoreHistory", JSON.stringify(history));
                router.push("/result");
            }
        }, 800);
    };

    if (questions.length === 0) {
        return (
            <main style={{ padding: 40 }}>
                <h2>問題を準備しています...</h2>
            </main>
        );
    }

    const current = questions[currentIndex];

    return (
        <main style={{ padding: 40 }}>
            <h2>同音異義語クイズ {currentIndex + 1} / {totalQuestions}</h2>
            <p style={{ marginBottom: 8 }}>次の文章の【　】に入る漢字を選んでください：</p>
            <p style={{ fontSize: "1.2rem", marginBottom: 20 }}>{current.sample}</p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {current.choices.map((choice) => (
                    <button
                        key={choice.word}
                        onClick={() => handleSelect(choice.word)}
                        style={{
                            padding: 10,
                            borderRadius: 8,
                            appearance: "none",
                            WebkitAppearance: "none",
                            background:
                                selected === choice.word
                                    ? choice.word === current.correctWord
                                        ? "#a0e7a0"
                                        : "#f7a8a8"
                                    : "#eee",
                            color: "#000",
                            border: "1px solid #ccc",
                        }}
                    >
                        {choice.word}
                    </button>
                ))}
            </div>

            <p style={{ marginTop: 20 }}>スコア: {score}</p>
        </main>
    );
}