"use client";

import dynamic from 'next/dynamic';

const HomophonesQuizClient = dynamic(() => import('./HomophonesQuizClient'));

export default function HomophonesQuizPage() {
  return <HomophonesQuizClient />;
}