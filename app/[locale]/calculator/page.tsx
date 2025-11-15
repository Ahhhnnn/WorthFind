"use client";

import { ButtonGroupRating } from "@/components/ButtonGroupRating";
import { CollapsibleCard } from "@/components/CollapsibleCard";
import { EmotionRating } from "@/components/EmotionRating";
import { ScoreDashboard } from "@/components/ScoreDashboard";
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";
import { ArrowLeft, Camera, Check, Clock, DollarSign, TrendingUp as GrowthIcon, Heart, Info, LucideIcon, Minus, Smile, TrendingDown, TrendingUp } from "lucide-react";
import { Link } from '@/i18n/routing';
import { useCallback, useMemo, useRef, useState } from "react";
import { useTranslations } from 'next-intl';

interface FormData {
  monthlySalary: number;
  annualBonus: number;
  benefits: number;
  weeklyHours: number;
  commuteHours: number;
  overtimeFrequency: number;
  skillGrowth: number;
  promotionChance: number;
  industryProspect: number;
  workPressure: number;
  teamAtmosphere: number;
  workInterest: number;
  workFlexibility: number;
  vacationBenefit: number;
  workLifeBalance: number;
}

interface CalculationResult {
  totalScore: number;
  level: string;
  color: string;
  icon: LucideIcon;
  humorLabel: string;
  humorDescription: string;
  dimensions: {
    economic: { score: number; percentage: number };
    time: { score: number; percentage: number };
    growth: { score: number; percentage: number };
    experience: { score: number; percentage: number };
    balance: { score: number; percentage: number };
  };
  hourlyValue: number;
  recommendations: string[];
}

interface DimensionScores {
  economic: number;
  time: number;
  growth: number;
  experience: number;
  balance: number;
  total: number;
}

export default function CalculatorPage() {
  const t = useTranslations('Calculator');
  const [formData, setFormData] = useState<FormData>({
    monthlySalary: 0,
    annualBonus: 0,
    benefits: 0,
    weeklyHours: 40,
    commuteHours: 0,
    overtimeFrequency: 3,
    skillGrowth: 3,
    promotionChance: 3,
    industryProspect: 3,
    workPressure: 3,
    teamAtmosphere: 3,
    workInterest: 3,
    workFlexibility: 3,
    vacationBenefit: 3,
    workLifeBalance: 3,
  });

  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureSuccess, setCaptureSuccess] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const updateFormData = (field: keyof FormData, value: number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateDimensionScores = useCallback((): DimensionScores => {
    const totalAnnualIncome = formData.monthlySalary * 12 + formData.annualBonus + formData.benefits;
    const totalWorkHours = formData.weeklyHours * 52 + formData.commuteHours * 52 * 5;
    const hourlyRate = totalAnnualIncome / Math.max(totalWorkHours, 1);

    const economicBase = Math.min((hourlyRate / 100) * 100, 100);
    const overtimePenalty = (5 - formData.overtimeFrequency) * 2;
    const economicScore = (economicBase * 0.8 + overtimePenalty * 0.2) * 0.3;

    const weeklyScore = Math.max(0, 100 - (formData.weeklyHours - 40) * 2);
    const commuteScore = Math.max(0, 100 - formData.commuteHours * 10);
    const overtimeScore = ((5 - formData.overtimeFrequency + 1) / 5) * 100;
    const timeScore = (weeklyScore * 0.4 + commuteScore * 0.3 + overtimeScore * 0.3) * 0.25;

    const growthScore = (
      (formData.skillGrowth / 5) * 40 +
      (formData.promotionChance / 5) * 35 +
      (formData.industryProspect / 5) * 25
    ) * 0.2;

    const experienceScore = (
      ((5 - formData.workPressure + 1) / 5) * 35 +
      (formData.teamAtmosphere / 5) * 35 +
      (formData.workInterest / 5) * 30
    ) * 0.15;

    const balanceScore = (
      (formData.workFlexibility / 5) * 33 +
      (formData.vacationBenefit / 5) * 33 +
      (formData.workLifeBalance / 5) * 34
    ) * 0.1;

    const totalScore = economicScore + timeScore + growthScore + experienceScore + balanceScore;

    return {
      economic: Math.round(economicScore * 10) / 10,
      time: Math.round(timeScore * 10) / 10,
      growth: Math.round(growthScore * 10) / 10,
      experience: Math.round(experienceScore * 10) / 10,
      balance: Math.round(balanceScore * 10) / 10,
      total: Math.round(totalScore * 10) / 10,
    };
  }, [formData]);

  // 使用 useMemo 计算维度分数，避免级联渲染
  const dimensionScores = useMemo(() => calculateDimensionScores(), [calculateDimensionScores]);

  const calculateScore = (): CalculationResult => {
    const scores = dimensionScores;

    const recommendations: string[] = [];

    if (scores.economic < 20) {
      recommendations.push(t('recommendations.lowEconomic'));
    }
    if (scores.time < 15) {
      recommendations.push(t('recommendations.highTimeCost'));
    }
    if (scores.growth < 12) {
      recommendations.push(t('recommendations.limitedGrowth'));
    }
    if (scores.experience < 9) {
      recommendations.push(t('recommendations.poorExperience'));
    }
    if (scores.balance < 6) {
      recommendations.push(t('recommendations.imbalance'));
    }

    if (scores.total >= 80) {
      recommendations.push(t('recommendations.excellent'));
    } else if (scores.total >= 60) {
      recommendations.push(t('recommendations.good'));
    } else if (scores.total >= 40) {
      recommendations.push(t('recommendations.average'));
    } else {
      recommendations.push(t('recommendations.poor'));
    }

    // 礼花特效，只在60分以上时显示
    if (scores.total >= 60) {
      // 立即触发中心爆发
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ff9800', '#ff5722']
      });

      // 连续从顶部落下礼花
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const interval = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);

        // 左侧礼花
        confetti({
          ...defaults,
          particleCount,
          origin: { x: Math.random() * 0.3, y: Math.random() - 0.2 },
          colors: ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5']
        });

        // 右侧礼花
        confetti({
          ...defaults,
          particleCount,
          origin: { x: 0.7 + Math.random() * 0.3, y: Math.random() - 0.2 },
          colors: ['#2196f3', '#00bcd4', '#009688', '#4caf50', '#8bc34a']
        });
      }, 250);
    }

    // 触发庆祝动画
    if (scores.total >= 80) {
      setTimeout(() => {
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.5 },
          colors: ['#ffd700', '#ffed4e', '#ffeb3b', '#ffc107', '#ff9800']
        });
      }, 500);
    }

    if (scores.total >= 90) {
      setTimeout(() => {
        confetti({
          particleCount: 200,
          angle: 60,
          spread: 55,
          origin: { x: 0 }
        });
        confetti({
          particleCount: 200,
          angle: 120,
          spread: 55,
          origin: { x: 1 }
        });
      }, 1000);
    }

    let level = "";
    let color = "";
    let icon = Minus;
    let humorLabel = "";
    let humorDescription = "";

    if (scores.total >= 90) {
      level = t('levels.excellent');
      color = "text-green-600";
      icon = TrendingUp;
      humorLabel = t('humorLabels.winner');
      humorDescription = t('humorDescriptions.winner');
    } else if (scores.total >= 80) {
      level = t('levels.excellent');
      color = "text-green-600";
      icon = TrendingUp;
      humorLabel = t('humorLabels.elite');
      humorDescription = t('humorDescriptions.elite');
    } else if (scores.total >= 70) {
      level = t('levels.good');
      color = "text-blue-600";
      icon = TrendingUp;
      humorLabel = t('humorLabels.whiteCollar');
      humorDescription = t('humorDescriptions.whiteCollar');
    } else if (scores.total >= 60) {
      level = t('levels.good');
      color = "text-blue-600";
      icon = TrendingUp;
      humorLabel = t('humorLabels.striver');
      humorDescription = t('humorDescriptions.striver');
    } else if (scores.total >= 50) {
      level = t('levels.average');
      color = "text-yellow-600";
      icon = Minus;
      humorLabel = t('humorLabels.worker');
      humorDescription = t('humorDescriptions.worker');
    } else if (scores.total >= 40) {
      level = t('levels.average');
      color = "text-yellow-600";
      icon = Minus;
      humorLabel = t('humorLabels.tool');
      humorDescription = t('humorDescriptions.tool');
    } else if (scores.total >= 30) {
      level = t('levels.needsImprovement');
      color = "text-red-600";
      icon = TrendingDown;
      humorLabel = t('humorLabels.horse');
      humorDescription = t('humorDescriptions.horse');
    } else {
      level = t('levels.needsImprovement');
      color = "text-red-600";
      icon = TrendingDown;
      humorLabel = t('humorLabels.sweatshop');
      humorDescription = t('humorDescriptions.sweatshop');
    }

    const totalAnnualIncome = formData.monthlySalary * 12 + formData.annualBonus + formData.benefits;
    const totalWorkHours = formData.weeklyHours * 52 + formData.commuteHours * 52 * 5;
    const hourlyRate = totalAnnualIncome / Math.max(totalWorkHours, 1);

    return {
      totalScore: scores.total,
      level,
      color,
      icon,
      humorLabel,
      humorDescription,
      dimensions: {
        economic: { score: scores.economic, percentage: 30 },
        time: { score: scores.time, percentage: 25 },
        growth: { score: scores.growth, percentage: 20 },
        experience: { score: scores.experience, percentage: 15 },
        balance: { score: scores.balance, percentage: 10 },
      },
      hourlyValue: Math.round(hourlyRate * 10) / 10,
      recommendations,
    };
  };

  const handleSubmit = () => {
    const calculationResult = calculateScore();
    setResult(calculationResult);
    // 滚动到页面顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCapture = async () => {
    if (!reportRef.current) return;

    setIsCapturing(true);
    setCaptureSuccess(false);

    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      const canvas = await html2canvas(reportRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true,
      });

      canvas.toBlob(async (blob) => {
        if (blob) {
          try {
            await navigator.clipboard.write([
              new ClipboardItem({
                'image/png': blob
              })
            ]);

            setCaptureSuccess(true);
            setTimeout(() => setCaptureSuccess(false), 3000);
          } catch (err) {
            console.error('复制到剪贴板失败:', err);
            const url = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = `${t('reportTitle')}-${new Date().getTime()}.png`;
            link.href = url;
            link.click();

            setCaptureSuccess(true);
            setTimeout(() => setCaptureSuccess(false), 3000);
          }
        }
        setIsCapturing(false);
      }, 'image/png');
    } catch (error) {
      console.error('截图失败:', error);
      setIsCapturing(false);
    }
  };

  const renderResult = () => {
    if (!result) return null;

    const Icon = result.icon;

    return (
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-end"
        >
          <Button
            onClick={handleCapture}
            disabled={isCapturing}
            variant="outline"
            className="gap-2"
          >
            {captureSuccess ? (
              <>
                <Check className="h-4 w-4 text-green-600" />
                {t('savedToClipboard')}
              </>
            ) : (
              <>
                <Camera className="h-4 w-4" />
                {isCapturing ? t('capturing') : t('saveAsImage')}
              </>
            )}
          </Button>
        </motion.div>

        <div ref={reportRef} className="space-y-8 bg-card p-8 rounded-xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold mb-4">{t('reportTitle')}</h2>
            <div className="inline-flex items-center gap-3 bg-card border rounded-xl p-6">
              <Icon className={`h-12 w-12 ${result.color}`} />
              <div className="text-left">
                <div className="text-sm text-muted-foreground">{t('overallScore')}</div>
                <div className="text-4xl font-bold">{result.totalScore}</div>
                <div className={`text-lg font-semibold ${result.color}`}>{result.level}</div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border border-purple-200 dark:border-purple-800 rounded-xl p-6"
            >
              <div className="text-2xl font-bold mb-2">{result.humorLabel}</div>
              <div className="text-muted-foreground">{result.humorDescription}</div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-card border rounded-xl p-6"
          >
            <h3 className="text-xl font-bold mb-4">{t('dimensionScores')}</h3>
            <div className="space-y-4">
              {[
                { key: "economic", label: t('dimensions.economic.label'), icon: "💰" },
                { key: "time", label: t('dimensions.time.label'), icon: "⏰" },
                { key: "growth", label: t('dimensions.growth.label'), icon: "📈" },
                { key: "experience", label: t('dimensions.experience.label'), icon: "😊" },
                { key: "balance", label: t('dimensions.balance.label'), icon: "⚖️" },
              ].map(({ key, label, icon }, index) => {
                const dim = result.dimensions[key as keyof typeof result.dimensions];
                const maxScore = dim.percentage;
                const percentage = (dim.score / maxScore) * 100;

                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{icon} {label}</span>
                      <span className="text-sm text-muted-foreground">
                        {dim.score.toFixed(1)} / {maxScore}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div
                        className="bg-primary rounded-full h-3 transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-card border rounded-xl p-6"
          >
            <h3 className="text-xl font-bold mb-4">{t('keyMetrics')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="text-sm text-muted-foreground mb-1">{t('hourlyValue')}</div>
                <div className="text-2xl font-bold">¥{result.hourlyValue.toFixed(2)}</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="text-sm text-muted-foreground mb-1">{t('totalWorkHours')}</div>
                <div className="text-2xl font-bold">
                  {((formData.weeklyHours + formData.commuteHours * 5) * 52).toFixed(0)}{t('hours')}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-6"
          >
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-bold mb-3 text-blue-900 dark:text-blue-100">{t('suggestions')}</h3>
                <ul className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="text-sm text-blue-800 dark:text-blue-200"
                    >
                      • {rec}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex gap-4"
        >
          <Button onClick={() => { setResult(null); }} className="flex-1">
            {t('recalculate')}
          </Button>
          <Button variant="outline" asChild className="flex-1">
            <Link href="/landing">{t('backToHome')}</Link>
          </Button>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button variant="ghost" asChild>
            <Link href="/landing">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('backToHome')}
            </Link>
          </Button>
        </div>

        <div className="max-w-4xl mx-auto">
          {!result ? (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">{t('title')}</h1>
                <p className="text-muted-foreground">{t('subtitle')}</p>
              </div>

              <ScoreDashboard
                totalScore={dimensionScores.total}
                dimensions={[
                  { score: dimensionScores.economic, label: t('dimensions.economic.label'), percentage: 30, icon: "💰" },
                  { score: dimensionScores.time, label: t('dimensions.time.label'), percentage: 25, icon: "⏰" },
                  { score: dimensionScores.growth, label: t('dimensions.growth.label'), percentage: 20, icon: "📈" },
                  { score: dimensionScores.experience, label: t('dimensions.experience.label'), percentage: 15, icon: "😊" },
                  { score: dimensionScores.balance, label: t('dimensions.balance.label'), percentage: 10, icon: "⚖️" },
                ]}
                translations={{
                  title: t('dashboard.title'),
                  overallScore: t('dashboard.overallScore'),
                  weight: t('dashboard.weight'),
                  statusExcellent: t('dashboard.statusExcellent'),
                  statusGood: t('dashboard.statusGood'),
                  statusAverage: t('dashboard.statusAverage'),
                  statusPoor: t('dashboard.statusPoor')
                }}
              />

              <CollapsibleCard
                title={t('dimensions.economic.title')}
                icon={<DollarSign className="h-5 w-5 text-blue-600" />}
                score={dimensionScores.economic}
                color="blue"
                scoreText={t('card.score')}
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">{t('dimensions.economic.monthlySalary')}</label>
                    <input
                      type="number"
                      value={formData.monthlySalary || ""}
                      onChange={(e) => updateFormData("monthlySalary", Number(e.target.value))}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                      placeholder={t('dimensions.economic.monthlySalaryPlaceholder')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{t('dimensions.economic.annualBonus')}</label>
                    <input
                      type="number"
                      value={formData.annualBonus || ""}
                      onChange={(e) => updateFormData("annualBonus", Number(e.target.value))}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                      placeholder={t('dimensions.economic.annualBonusPlaceholder')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{t('dimensions.economic.benefits')}</label>
                    <input
                      type="number"
                      value={formData.benefits || ""}
                      onChange={(e) => updateFormData("benefits", Number(e.target.value))}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                      placeholder={t('dimensions.economic.benefitsPlaceholder')}
                    />
                    <p className="text-xs text-muted-foreground mt-1">{t('dimensions.economic.benefitsHint')}</p>
                  </div>
                </div>
              </CollapsibleCard>

              <CollapsibleCard
                title={t('dimensions.time.title')}
                icon={<Clock className="h-5 w-5 text-green-600" />}
                score={dimensionScores.time}
                color="green"
                scoreText={t('card.score')}
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">{t('dimensions.time.weeklyHours')}</label>
                    <input
                      type="number"
                      value={formData.weeklyHours || ""}
                      onChange={(e) => updateFormData("weeklyHours", Number(e.target.value))}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                      placeholder={t('dimensions.time.weeklyHoursPlaceholder')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{t('dimensions.time.commuteHours')}</label>
                    <input
                      type="number"
                      step="0.5"
                      value={formData.commuteHours || ""}
                      onChange={(e) => updateFormData("commuteHours", Number(e.target.value))}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                      placeholder={t('dimensions.time.commuteHoursPlaceholder')}
                    />
                  </div>
                  <div>
                    <EmotionRating
                      value={formData.overtimeFrequency}
                      onChange={(value) => updateFormData("overtimeFrequency", value)}
                      labels={[
                        t('dimensions.time.overtimeLabels.0'),
                        t('dimensions.time.overtimeLabels.1'),
                        t('dimensions.time.overtimeLabels.2'),
                        t('dimensions.time.overtimeLabels.3'),
                        t('dimensions.time.overtimeLabels.4')
                      ]}
                      icons={["😊", "🙂", "😐", "😟", "😫"]}
                    />
                    <p className="text-xs text-muted-foreground mt-2 text-center">{t('dimensions.time.overtimeFrequency')}</p>
                  </div>
                </div>
              </CollapsibleCard>

              <CollapsibleCard
                title={t('dimensions.growth.title')}
                icon={<GrowthIcon className="h-5 w-5 text-purple-600" />}
                score={dimensionScores.growth}
                color="purple"
                scoreText={t('card.score')}
              >
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm font-medium">{t('dimensions.growth.skillGrowth')}</span>
                      <span className="text-xs text-muted-foreground">(1-5分)</span>
                    </div>
                    <ButtonGroupRating
                      value={formData.skillGrowth}
                      onChange={(value) => updateFormData("skillGrowth", value)}
                      labels={[
                        t('dimensions.growth.skillGrowthLabels.0'),
                        t('dimensions.growth.skillGrowthLabels.1'),
                        t('dimensions.growth.skillGrowthLabels.2'),
                        t('dimensions.growth.skillGrowthLabels.3'),
                        t('dimensions.growth.skillGrowthLabels.4')
                      ]}
                      color="purple"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm font-medium">{t('dimensions.growth.promotionChance')}</span>
                      <span className="text-xs text-muted-foreground">(1-5分)</span>
                    </div>
                    <ButtonGroupRating
                      value={formData.promotionChance}
                      onChange={(value) => updateFormData("promotionChance", value)}
                      labels={[
                        t('dimensions.growth.promotionChanceLabels.0'),
                        t('dimensions.growth.promotionChanceLabels.1'),
                        t('dimensions.growth.promotionChanceLabels.2'),
                        t('dimensions.growth.promotionChanceLabels.3'),
                        t('dimensions.growth.promotionChanceLabels.4')
                      ]}
                      color="purple"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm font-medium">{t('dimensions.growth.industryProspect')}</span>
                      <span className="text-xs text-muted-foreground">(1-5分)</span>
                    </div>
                    <ButtonGroupRating
                      value={formData.industryProspect}
                      onChange={(value) => updateFormData("industryProspect", value)}
                      labels={[
                        t('dimensions.growth.industryProspectLabels.0'),
                        t('dimensions.growth.industryProspectLabels.1'),
                        t('dimensions.growth.industryProspectLabels.2'),
                        t('dimensions.growth.industryProspectLabels.3'),
                        t('dimensions.growth.industryProspectLabels.4')
                      ]}
                      color="purple"
                    />
                  </div>
                </div>
              </CollapsibleCard>

              <CollapsibleCard
                title={t('dimensions.experience.title')}
                icon={<Smile className="h-5 w-5 text-yellow-600" />}
                score={dimensionScores.experience}
                color="yellow"
                scoreText={t('card.score')}
              >
                <div className="space-y-6">
                  <div>
                    <EmotionRating
                      value={formData.workPressure}
                      onChange={(value) => updateFormData("workPressure", value)}
                      labels={[
                        t('dimensions.experience.workPressureLabels.0'),
                        t('dimensions.experience.workPressureLabels.1'),
                        t('dimensions.experience.workPressureLabels.2'),
                        t('dimensions.experience.workPressureLabels.3'),
                        t('dimensions.experience.workPressureLabels.4')
                      ]}
                      icons={["😊", "🙂", "😐", "😟", "😰"]}
                    />
                    <p className="text-xs text-muted-foreground mt-2 text-center">{t('dimensions.experience.workPressure')}</p>
                  </div>
                  <div>
                    <EmotionRating
                      value={formData.teamAtmosphere}
                      onChange={(value) => updateFormData("teamAtmosphere", value)}
                      labels={[
                        t('dimensions.experience.teamAtmosphereLabels.0'),
                        t('dimensions.experience.teamAtmosphereLabels.1'),
                        t('dimensions.experience.teamAtmosphereLabels.2'),
                        t('dimensions.experience.teamAtmosphereLabels.3'),
                        t('dimensions.experience.teamAtmosphereLabels.4')
                      ]}
                      icons={["😡", "😟", "😐", "😊", "😄"]}
                    />
                    <p className="text-xs text-muted-foreground mt-2 text-center">{t('dimensions.experience.teamAtmosphere')}</p>
                  </div>
                  <div>
                    <EmotionRating
                      value={formData.workInterest}
                      onChange={(value) => updateFormData("workInterest", value)}
                      labels={[
                        t('dimensions.experience.workInterestLabels.0'),
                        t('dimensions.experience.workInterestLabels.1'),
                        t('dimensions.experience.workInterestLabels.2'),
                        t('dimensions.experience.workInterestLabels.3'),
                        t('dimensions.experience.workInterestLabels.4')
                      ]}
                      icons={["😴", "😐", "🤔", "😊", "🤩"]}
                    />
                    <p className="text-xs text-muted-foreground mt-2 text-center">{t('dimensions.experience.workInterest')}</p>
                  </div>
                </div>
              </CollapsibleCard>

              <CollapsibleCard
                title={t('dimensions.balance.title')}
                icon={<Heart className="h-5 w-5 text-red-600" />}
                score={dimensionScores.balance}
                color="red"
                scoreText={t('card.score')}
              >
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm font-medium">{t('dimensions.balance.workFlexibility')}</span>
                      <span className="text-xs text-muted-foreground">(1-5分)</span>
                    </div>
                    <ButtonGroupRating
                      value={formData.workFlexibility}
                      onChange={(value) => updateFormData("workFlexibility", value)}
                      labels={[
                        t('dimensions.balance.workFlexibilityLabels.0'),
                        t('dimensions.balance.workFlexibilityLabels.1'),
                        t('dimensions.balance.workFlexibilityLabels.2'),
                        t('dimensions.balance.workFlexibilityLabels.3'),
                        t('dimensions.balance.workFlexibilityLabels.4')
                      ]}
                      color="red"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm font-medium">{t('dimensions.balance.vacationBenefit')}</span>
                      <span className="text-xs text-muted-foreground">(1-5分)</span>
                    </div>
                    <ButtonGroupRating
                      value={formData.vacationBenefit}
                      onChange={(value) => updateFormData("vacationBenefit", value)}
                      labels={[
                        t('dimensions.balance.vacationBenefitLabels.0'),
                        t('dimensions.balance.vacationBenefitLabels.1'),
                        t('dimensions.balance.vacationBenefitLabels.2'),
                        t('dimensions.balance.vacationBenefitLabels.3'),
                        t('dimensions.balance.vacationBenefitLabels.4')
                      ]}
                      color="red"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm font-medium">{t('dimensions.balance.workLifeBalance')}</span>
                      <span className="text-xs text-muted-foreground">(1-5分)</span>
                    </div>
                    <ButtonGroupRating
                      value={formData.workLifeBalance}
                      onChange={(value) => updateFormData("workLifeBalance", value)}
                      labels={[
                        t('dimensions.balance.workLifeBalanceLabels.0'),
                        t('dimensions.balance.workLifeBalanceLabels.1'),
                        t('dimensions.balance.workLifeBalanceLabels.2'),
                        t('dimensions.balance.workLifeBalanceLabels.3'),
                        t('dimensions.balance.workLifeBalanceLabels.4')
                      ]}
                      color="red"
                    />
                  </div>
                </div>
              </CollapsibleCard>

              <div className="flex gap-4 pt-4">
                <Button
                  onClick={handleSubmit}
                  className="flex-1 text-lg py-6"
                  disabled={dimensionScores.total === 0}
                >
                  {t('generateReport')}
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-card border rounded-xl p-8 shadow-lg">
              {renderResult()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
