"use client";

import { Header } from "./landing/components/Header";
import { Footer } from "./landing/components/Footer";
import CalculatorPage from "./calculator/page";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <Header />
      <CalculatorPage />
      <Footer />
    </div>
  );
}
