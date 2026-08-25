import {
  BirthDay,
  CareerCategory,
  DecomposedPair,
  LifeGoal,
  Provider,
  ScoredNumber,
} from "@/types";
import { PAIR_RULES_MAP, getPairRule } from "./pairs-data";
import { BIRTH_RULES } from "./birth-rules";
import { CAREER_RULES } from "./career-rules";
import { getSumRule } from "./sum-data";
import { formatPhoneNumber } from "../utils";

export interface ScoreOptions {
  id?: string;
  provider?: Provider;
  source?: string;
  price?: number;
  priceDisplay?: string;
  packageDetail?: string;
  buyUrl?: string;
  birthDay?: BirthDay;
  career?: CareerCategory;
  goals?: LifeGoal[];
}

export function scorePhoneNumber(
  rawInput: string,
  options: ScoreOptions = {}
): ScoredNumber {
  const cleanNumber = rawInput.replace(/\D/g, "");
  const formattedNumber = formatPhoneNumber(cleanNumber);
  const id = options.id || `num_${cleanNumber}_${Date.now()}`;
  const provider = options.provider || "AIS";
  const source = options.source || (provider === "AIS" ? "AIS Online Store" : provider === "TRUE" ? "True Store" : "Shopee Mall");
  const price = options.price ?? 0;
  const priceDisplay = options.priceDisplay || (price > 0 ? price.toLocaleString() : undefined);
  const packageDetail = options.packageDetail || "แพ็กเกจมาตรฐาน 5G";
  const buyUrl = options.buyUrl || `https://store.ais.co.th/th/number-search?q=${cleanNumber}`;

  // 1. Calculate Sum (ผลรวม 10 หลัก)
  const digits = cleanNumber.split("").map((d) => parseInt(d, 10));
  const totalSum = digits.reduce((acc, curr) => acc + (isNaN(curr) ? 0 : curr), 0);
  const sumRule = getSumRule(totalSum);

  // 2. Extract Decomposed Pairs from last 7 digits (เช่น 081-234-5678 -> 2345678 -> 23, 34, 45, 56, 67, 78)
  const last7 = cleanNumber.slice(-7);
  const decomposedPairs: DecomposedPair[] = [];
  const dangerousPairsFound: string[] = [];

  let rawPairQualitySum = 0;
  const energyAccumulator = { wealth: 0, charm: 0, prestige: 0, wisdom: 0, luck: 0 };

  for (let i = 0; i < last7.length - 1; i++) {
    const pairStr = last7.slice(i, i + 2);
    const rule = getPairRule(pairStr);
    const isDangerous = rule.isDangerous;

    if (isDangerous) {
      dangerousPairsFound.push(pairStr);
    }

    rawPairQualitySum += rule.scoreDelta;
    energyAccumulator.wealth += rule.energyScores.wealth;
    energyAccumulator.charm += rule.energyScores.charm;
    energyAccumulator.prestige += rule.energyScores.prestige;
    energyAccumulator.wisdom += rule.energyScores.wisdom;
    energyAccumulator.luck += rule.energyScores.luck;

    decomposedPairs.push({
      position: i + 1,
      pair: pairStr,
      rule,
      isDangerous,
      scoreContribution: rule.scoreDelta,
    });
  }

  // Energy Profile Normalized (0-100)
  const pairCount = Math.max(decomposedPairs.length, 1);
  const energyProfile = {
    wealth: Math.min(100, Math.round((energyAccumulator.wealth / (pairCount * 10)) * 100)),
    charm: Math.min(100, Math.round((energyAccumulator.charm / (pairCount * 10)) * 100)),
    prestige: Math.min(100, Math.round((energyAccumulator.prestige / (pairCount * 10)) * 100)),
    wisdom: Math.min(100, Math.round((energyAccumulator.wisdom / (pairCount * 10)) * 100)),
    luck: Math.min(100, Math.round((energyAccumulator.luck / (pairCount * 10)) * 100)),
  };

  // Pair Score Component (0-100)
  // Max possible raw delta is around 20 * 6 = 120
  let pairScore = Math.round(((rawPairQualitySum + 40) / 160) * 100);
  pairScore = Math.max(0, Math.min(100, pairScore));
  if (dangerousPairsFound.length > 0) {
    pairScore = Math.max(10, pairScore - (dangerousPairsFound.length * 30));
  }

  // Sum Score Component (0-100)
  let sumScore = sumRule.isAuspicious ? 90 : 45;
  if (sumRule.tier === "A+") sumScore = 100;
  else if (sumRule.tier === "A") sumScore = 88;
  else if (sumRule.tier === "B") sumScore = 75;
  else if (sumRule.tier === "C") sumScore = 55;
  else if (sumRule.tier === "F") sumScore = 20;

  // 3. Birth Day Compatibility Component (0-100)
  let birthScore = 80; // default if no birthday specified
  let hasKalaKinee = false;
  const kalaKineeDigitsFound: number[] = [];

  if (options.birthDay && BIRTH_RULES[options.birthDay]) {
    const bRule = BIRTH_RULES[options.birthDay];
    const last7Digits = last7.split("").map((d) => parseInt(d, 10));

    // Check Kala Kinee
    for (const forbidden of bRule.forbiddenDigits) {
      if (last7Digits.includes(forbidden)) {
        hasKalaKinee = true;
        kalaKineeDigitsFound.push(forbidden);
      }
    }

    // Check Auspicious Digits
    let auspiciousMatches = 0;
    for (const aus of bRule.auspiciousDigits) {
      if (last7Digits.includes(aus)) {
        auspiciousMatches++;
      }
    }

    if (hasKalaKinee) {
      birthScore = Math.max(10, 40 - (kalaKineeDigitsFound.length * 20));
    } else {
      birthScore = Math.min(100, 75 + (auspiciousMatches * 5));
    }
  }

  // 4. Career Compatibility Component (0-100)
  let careerScore = 80; // default if no career specified
  if (options.career && CAREER_RULES[options.career]) {
    const cRule = CAREER_RULES[options.career];
    const pairsInNumber = decomposedPairs.map((p) => p.pair);

    let essentialMatches = 0;
    let bonusMatches = 0;
    let forbiddenMatches = 0;

    for (const ep of cRule.essentialPairs) {
      if (pairsInNumber.includes(ep)) essentialMatches++;
    }
    for (const bp of cRule.bonusPairs) {
      if (pairsInNumber.includes(bp)) bonusMatches++;
    }
    for (const fp of cRule.forbiddenPairs) {
      if (pairsInNumber.includes(fp)) forbiddenMatches++;
    }

    careerScore = 65 + (essentialMatches * 12) + (bonusMatches * 6) - (forbiddenMatches * 20);
    careerScore = Math.max(15, Math.min(100, careerScore));
  }

  // 5. Goals Alignment Component (0-100)
  let goalsScore = 80;
  if (options.goals && options.goals.length > 0) {
    let goalSum = 0;
    for (const goal of options.goals) {
      if (goal === "wealth") goalSum += energyProfile.wealth;
      else if (goal === "charm_love") goalSum += energyProfile.charm;
      else if (goal === "prestige_power") goalSum += energyProfile.prestige;
      else if (goal === "wisdom_peace") goalSum += energyProfile.wisdom;
      else if (goal === "luck_windfall") goalSum += energyProfile.luck;
      else if (goal === "health_safety") goalSum += (energyProfile.wisdom + energyProfile.luck) / 2;
    }
    goalsScore = Math.round(goalSum / options.goals.length);
  }

  // 6. Calculate Weighted Total Score (0-100)
  // Pair Quality: 35%, Sum: 20%, Birth: 20%, Career & Goals: 25%
  const careerAndGoals = options.goals && options.goals.length > 0 
    ? (careerScore * 0.6 + goalsScore * 0.4) 
    : careerScore;

  let totalScore = Math.round(
    (pairScore * 0.35) +
    (sumScore * 0.20) +
    (birthScore * 0.20) +
    (careerAndGoals * 0.25)
  );

  // Safety Caps for Inauspicious Conditions
  if (dangerousPairsFound.length > 0) {
    totalScore = Math.min(totalScore, 58 - ((dangerousPairsFound.length - 1) * 10));
  }
  if (hasKalaKinee) {
    totalScore = Math.min(totalScore, 62);
  }

  totalScore = Math.max(5, Math.min(100, totalScore));

  const isTopCandidate = 
    totalScore >= 88 && 
    dangerousPairsFound.length === 0 && 
    !hasKalaKinee && 
    sumRule.isAuspicious;

  return {
    id,
    rawNumber: cleanNumber,
    formattedNumber,
    provider,
    source,
    price,
    priceDisplay,
    packageDetail,
    buyUrl,
    totalSum,
    sumRule,
    totalScore,
    pairScore,
    sumScore,
    birthScore,
    careerScore,
    goalsScore,
    decomposedPairs,
    dangerousPairsFound,
    hasKalaKinee,
    kalaKineeDigitsFound,
    isTopCandidate,
    energyProfile,
  };
}
