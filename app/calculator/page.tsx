"use client";

import { useState, useRef, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, TrendingDown, Minus, Info, LucideIcon, Camera, Check, DollarSign, Clock, TrendingUp as GrowthIcon, Smile, Heart } from "lucide-react";
import Link from "next/link";
import html2canvas from "html2canvas";
import { motion, AnimatePresence } from "framer-motion";
import { CollapsibleCard } from "@/components/CollapsibleCard";
import { ScoreDashboard } from "@/components/ScoreDashboard";
import { EmotionRating } from "@/components/EmotionRating";
import { ButtonGroupRating } from "@/components/ButtonGroupRating";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";

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
      recommendations.push("经济回报偏低，建议考虑薪资谈判或寻找更好的机会");
    }
    if (scores.time < 15) {
      recommendations.push("时间成本过高，建议优化工作时间或减少通勤时间");
    }
    if (scores.growth < 12) {
      recommendations.push("成长空间有限，建议主动寻求学习机会或考虑转型");
    }
    if (scores.experience < 9) {
      recommendations.push("工作体验不佳，建议与管理层沟通或考虑换环境");
    }
    if (scores.balance < 6) {
      recommendations.push("工作生活失衡，建议设定明确边界或寻求更灵活的工作");
    }

    if (scores.total >= 80) {
      recommendations.push("整体性价比优秀，继续保持并寻求更高层次发展");
    } else if (scores.total >= 60) {
      recommendations.push("整体表现良好，可针对薄弱维度进行优化");
    } else if (scores.total >= 40) {
      recommendations.push("性价比中等，建议制定改进计划，考虑是否需要做出改变");
    } else {
      recommendations.push("性价比较低，强烈建议重新评估职业选择，寻求更好的机会");
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

      const interval = setInterval(function() {
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
      level = "优秀";
      color = "text-green-600";
      icon = TrendingUp;
      humorLabel = "🎉 人生赢家";
      humorDescription = "这就是传说中的躺赢模式";
    } else if (scores.total >= 80) {
      level = "优秀";
      color = "text-green-600";
      icon = TrendingUp;
      humorLabel = "😎 职场精英";
      humorDescription = "别人996，你在享受生活";
    } else if (scores.total >= 70) {
      level = "良好";
      color = "text-blue-600";
      icon = TrendingUp;
      humorLabel = "💼 白领一族";
      humorDescription = "体面工作，稳中向好";
    } else if (scores.total >= 60) {
      level = "良好";
      color = "text-blue-600";
      icon = TrendingUp;
      humorLabel = "🏃 奋斗青年";
      humorDescription = "有点累但还算值得";
    } else if (scores.total >= 50) {
      level = "中等";
      color = "text-yellow-600";
      icon = Minus;
      humorLabel = "😅 打工人";
      humorDescription = "标准社畜，勉强糊口";
    } else if (scores.total >= 40) {
      level = "中等";
      color = "text-yellow-600";
      icon = Minus;
      humorLabel = "😓 工具人";
      humorDescription = "付出与回报不太匹配";
    } else if (scores.total >= 30) {
      level = "待改善";
      color = "text-red-600";
      icon = TrendingDown;
      humorLabel = "🐴 现代牛马";
      humorDescription = "建议考虑跳槽改命";
    } else {
      level = "待改善";
      color = "text-red-600";
      icon = TrendingDown;
      humorLabel = "💀 血汗工厂";
      humorDescription = "快跑！留得青山在";
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
            link.download = `工作性价比报告-${new Date().getTime()}.png`;
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
                已保存到剪贴板
              </>
            ) : (
              <>
                <Camera className="h-4 w-4" />
                {isCapturing ? '截图中...' : '保存为图片'}
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
            <h2 className="text-3xl font-bold mb-4">你的工作性价比评估报告</h2>
            <div className="inline-flex items-center gap-3 bg-card border rounded-xl p-6">
              <Icon className={`h-12 w-12 ${result.color}`} />
              <div className="text-left">
                <div className="text-sm text-muted-foreground">综合得分</div>
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
            <h3 className="text-xl font-bold mb-4">各维度得分</h3>
            <div className="space-y-4">
              {[
                { key: "economic", label: "经济回报", icon: "💰" },
                { key: "time", label: "时间成本", icon: "⏰" },
                { key: "growth", label: "成长价值", icon: "📈" },
                { key: "experience", label: "工作体验", icon: "😊" },
                { key: "balance", label: "生活平衡", icon: "⚖️" },
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
            <h3 className="text-xl font-bold mb-4">关键指标</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="text-sm text-muted-foreground mb-1">时薪价值</div>
                <div className="text-2xl font-bold">¥{result.hourlyValue.toFixed(2)}</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="text-sm text-muted-foreground mb-1">年工作总时长</div>
                <div className="text-2xl font-bold">
                  {((formData.weeklyHours + formData.commuteHours * 5) * 52).toFixed(0)}小时
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
                <h3 className="text-lg font-bold mb-3 text-blue-900 dark:text-blue-100">改进建议</h3>
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
            重新计算
          </Button>
          <Button variant="outline" asChild className="flex-1">
            <Link href="/landing">返回首页</Link>
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
              返回首页
            </Link>
          </Button>
        </div>

        <div className="max-w-4xl mx-auto">
          {!result ? (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">工作性价比评估</h1>
                <p className="text-muted-foreground">填写以下各维度信息，实时查看你的得分</p>
              </div>

              <ScoreDashboard
                totalScore={dimensionScores.total}
                dimensions={[
                  { score: dimensionScores.economic, label: "经济回报", percentage: 30, icon: "💰" },
                  { score: dimensionScores.time, label: "时间成本", percentage: 25, icon: "⏰" },
                  { score: dimensionScores.growth, label: "成长价值", percentage: 20, icon: "📈" },
                  { score: dimensionScores.experience, label: "工作体验", percentage: 15, icon: "😊" },
                  { score: dimensionScores.balance, label: "生活平衡", percentage: 10, icon: "⚖️" },
                ]}
              />

              <CollapsibleCard
                title="💰 经济回报"
                icon={<DollarSign className="h-5 w-5 text-blue-600" />}
                score={dimensionScores.economic}
                color="blue"
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">月薪收入（元）</label>
                    <input
                      type="number"
                      value={formData.monthlySalary || ""}
                      onChange={(e) => updateFormData("monthlySalary", Number(e.target.value))}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                      placeholder="如：15000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">年终奖（元）</label>
                    <input
                      type="number"
                      value={formData.annualBonus || ""}
                      onChange={(e) => updateFormData("annualBonus", Number(e.target.value))}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                      placeholder="如：30000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">其他福利年价值（元）</label>
                    <input
                      type="number"
                      value={formData.benefits || ""}
                      onChange={(e) => updateFormData("benefits", Number(e.target.value))}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                      placeholder="如：5000（五险一金、补贴等折算年价值）"
                    />
                    <p className="text-xs text-muted-foreground mt-1">包括五险一金、交通补贴、餐补等</p>
                  </div>
                </div>
              </CollapsibleCard>

              <CollapsibleCard
                title="⏰ 时间成本"
                icon={<Clock className="h-5 w-5 text-green-600" />}
                score={dimensionScores.time}
                color="green"
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">周工作时长（小时）</label>
                    <input
                      type="number"
                      value={formData.weeklyHours || ""}
                      onChange={(e) => updateFormData("weeklyHours", Number(e.target.value))}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                      placeholder="如：40"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">每日通勤时长（小时）</label>
                    <input
                      type="number"
                      step="0.5"
                      value={formData.commuteHours || ""}
                      onChange={(e) => updateFormData("commuteHours", Number(e.target.value))}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                      placeholder="如：2（往返总时长）"
                    />
                  </div>
                  <div>
                    <EmotionRating
                      value={formData.overtimeFrequency}
                      onChange={(value) => updateFormData("overtimeFrequency", value)}
                      labels={["几乎不", "很少", "有时", "经常", "总是"]}
                      icons={["😊", "🙂", "😐", "😟", "😫"]}
                    />
                    <p className="text-xs text-muted-foreground mt-2 text-center">加班频率</p>
                  </div>
                </div>
              </CollapsibleCard>

              <CollapsibleCard
                title="📈 成长价值"
                icon={<GrowthIcon className="h-5 w-5 text-purple-600" />}
                score={dimensionScores.growth}
                color="purple"
              >
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm font-medium">技能提升机会</span>
                      <span className="text-xs text-muted-foreground">(1-5分)</span>
                    </div>
                    <ButtonGroupRating
                      value={formData.skillGrowth}
                      onChange={(value) => updateFormData("skillGrowth", value)}
                      labels={["很少学习", "偶尔学习", "一般", "经常学习", "持续成长"]}
                      color="purple"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm font-medium">晋升空间</span>
                      <span className="text-xs text-muted-foreground">(1-5分)</span>
                    </div>
                    <ButtonGroupRating
                      value={formData.promotionChance}
                      onChange={(value) => updateFormData("promotionChance", value)}
                      labels={["几乎没机会", "机会很小", "中等机会", "机会较多", "机会很多"]}
                      color="purple"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm font-medium">行业前景</span>
                      <span className="text-xs text-muted-foreground">(1-5分)</span>
                    </div>
                    <ButtonGroupRating
                      value={formData.industryProspect}
                      onChange={(value) => updateFormData("industryProspect", value)}
                      labels={["前景堪忧", "不太乐观", "一般", "比较光明", "前景光明"]}
                      color="purple"
                    />
                  </div>
                </div>
              </CollapsibleCard>

              <CollapsibleCard
                title="😊 工作体验"
                icon={<Smile className="h-5 w-5 text-yellow-600" />}
                score={dimensionScores.experience}
                color="yellow"
              >
                <div className="space-y-6">
                  <div>
                    <EmotionRating
                      value={formData.workPressure}
                      onChange={(value) => updateFormData("workPressure", value)}
                      labels={["压力很小", "压力较小", "压力适中", "压力较大", "压力很大"]}
                      icons={["😊", "🙂", "😐", "😟", "😰"]}
                    />
                    <p className="text-xs text-muted-foreground mt-2 text-center">工作压力</p>
                  </div>
                  <div>
                    <EmotionRating
                      value={formData.teamAtmosphere}
                      onChange={(value) => updateFormData("teamAtmosphere", value)}
                      labels={["氛围较差", "不太好", "一般", "比较好", "氛围很好"]}
                      icons={["😡", "😟", "😐", "😊", "😄"]}
                    />
                    <p className="text-xs text-muted-foreground mt-2 text-center">团队氛围</p>
                  </div>
                  <div>
                    <EmotionRating
                      value={formData.workInterest}
                      onChange={(value) => updateFormData("workInterest", value)}
                      labels={["不感兴趣", "不太喜欢", "一般", "比较喜欢", "非常喜欢"]}
                      icons={["😴", "😐", "🤔", "😊", "🤩"]}
                    />
                    <p className="text-xs text-muted-foreground mt-2 text-center">工作兴趣度</p>
                  </div>
                </div>
              </CollapsibleCard>

              <CollapsibleCard
                title="⚖️ 生活平衡"
                icon={<Heart className="h-5 w-5 text-red-600" />}
                score={dimensionScores.balance}
                color="red"
              >
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm font-medium">工作灵活度</span>
                      <span className="text-xs text-muted-foreground">(1-5分)</span>
                    </div>
                    <ButtonGroupRating
                      value={formData.workFlexibility}
                      onChange={(value) => updateFormData("workFlexibility", value)}
                      labels={["很不灵活", "不太灵活", "一般", "比较灵活", "非常灵活"]}
                      color="red"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm font-medium">假期福利</span>
                      <span className="text-xs text-muted-foreground">(1-5分)</span>
                    </div>
                    <ButtonGroupRating
                      value={formData.vacationBenefit}
                      onChange={(value) => updateFormData("vacationBenefit", value)}
                      labels={["假期很少", "较少", "一般", "比较多", "假期充足"]}
                      color="red"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm font-medium">工作生活平衡</span>
                      <span className="text-xs text-muted-foreground">(1-5分)</span>
                    </div>
                    <ButtonGroupRating
                      value={formData.workLifeBalance}
                      onChange={(value) => updateFormData("workLifeBalance", value)}
                      labels={["严重失衡", "比较失衡", "一般", "比较平衡", "平衡良好"]}
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
                  生成完整报告
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
