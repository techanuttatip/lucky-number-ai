import { SearchCriteria, ScoredNumber, HunterJob } from "@/types";
import { AisHunterScraper } from "./ais-hunter";
import { huntShopeeNumbers } from "./shopee-hunter";
import { scorePhoneNumber } from "../numerology/scorer";
import { evaluateNumberWithAIJudge } from "../ai/ai-judge";
import { BIRTH_RULES } from "../numerology/birth-rules";
import { CAREER_RULES } from "../numerology/career-rules";
import { db } from "../store/in-memory-db";

export interface HunterPipelineResult {
  jobId: string;
  totalScanned: number;
  totalFiltered: number;
  topCandidates: ScoredNumber[];
  allCandidates: ScoredNumber[];
  logs: string[];
}

export class HunterService {
  private aisScraper = new AisHunterScraper();

  async executeHunt(
    criteria: SearchCriteria,
    jobId?: string,
    customTitle?: string,
    frequency: "once" | "hourly" | "daily" | "weekly" = "hourly"
  ): Promise<HunterPipelineResult> {
    const logs: string[] = [];
    const actualJobId = jobId || `hunt_${Date.now()}`;

    logs.push(`[Hunter Pipeline] เริ่มต้นรันงานค้นหา ID: ${actualJobId}`);
    logs.push(`[Hunter Pipeline] เกณฑ์: วันเกิด ${criteria.birthDay || "-"}, อาชีพ ${criteria.career || "-"}, งบ ${criteria.budgetMax ? criteria.budgetMax + " บ." : "ไม่จำกัด"}`);

    // Step 1: Hunt raw numbers from AIS & Shopee Store sources
    const rawResult = await this.aisScraper.huntNumbers(criteria);
    logs.push(...rawResult.logs);

    try {
      const shopeeFound = await huntShopeeNumbers(criteria);
      logs.push(`[Shopee Hunter] สแกนร้านค้า Shopee Mall สำเร็จ พบเบอร์ตรงเกณฑ์ ${shopeeFound.length} เบอร์`);
      rawResult.foundNumbers.push(...shopeeFound);
    } catch (e) {
      console.warn("Shopee hunter error:", e);
    }

    // Step 2: Run Deterministic Numerology Scoring Engine on all candidates
    logs.push(`[Rule Engine] กำลังประมวลผลคะแนนเลขศาสตร์ 0-100 สำหรับเบอร์ทั้งหมด...`);
    const scoredList: ScoredNumber[] = [];

    for (const item of rawResult.foundNumbers) {
      const scored = scorePhoneNumber(item.rawNumber, {
        id: `hunt_${actualJobId}_${item.rawNumber}`,
        provider: item.provider,
        price: item.price,
        packageDetail: item.packageDetail,
        buyUrl: item.buyUrl,
        birthDay: criteria.birthDay,
        career: criteria.career,
        goals: criteria.goals,
      });
      scoredList.push(scored);
    }

    // Step 3: Filter & Sort by Total Score
    let filteredList = scoredList;

    // Must-have pairs filter
    if (criteria.mustHavePairs && criteria.mustHavePairs.length > 0) {
      filteredList = filteredList.filter((n) => {
        const pairsInNum = n.decomposedPairs.map((p) => p.pair);
        return criteria.mustHavePairs!.some((reqPair) => pairsInNum.includes(reqPair) || n.rawNumber.includes(reqPair));
      });
    }

    // Sort descending by totalScore
    filteredList.sort((a, b) => b.totalScore - a.totalScore);
    const topCandidates = filteredList.slice(0, 10);

    logs.push(`[Rule Engine] คัดแยกเสร็จสิ้น: เบอร์เกรดสูง (80+) มีทั้งหมด ${filteredList.filter((n) => n.totalScore >= 80).length} เบอร์`);

    // Step 4: Run AI Judge on top 2 candidates for Second Opinion
    const userBirthName = criteria.birthDay ? BIRTH_RULES[criteria.birthDay]?.nameTh : undefined;
    const userCareerName = criteria.career ? CAREER_RULES[criteria.career]?.titleTh : undefined;

    for (const topNum of topCandidates.slice(0, 2)) {
      try {
        const verdict = await evaluateNumberWithAIJudge(topNum, {
          userBirthDayName: userBirthName,
          userCareerName: userCareerName,
          userGoals: criteria.goals,
        });
        topNum.aiVerdict = verdict;
      } catch (err) {
        console.error("AI Judge evaluation failed for number:", topNum.formattedNumber, err);
      }
    }

    // Step 5: Persist to DB store
    db.saveBulkNumbers(filteredList);

    // Update or create job record
    const jobRecord: HunterJob = {
      id: actualJobId,
      title: customTitle || `ค้นหาเบอร์ ${userCareerName || "ทั่วไป"} ${userBirthName || ""}`,
      criteria,
      status: "completed",
      frequency,
      totalFound: rawResult.foundNumbers.length,
      topCandidatesCount: topCandidates.length,
      lastRunAt: new Date().toISOString(),
      logs,
    };
    db.saveJob(jobRecord);

    logs.push(`[Hunter Pipeline] กระบวนการเสร็จสมบูรณ์เรียบร้อย! พร้อมแสดงผลบน Dashboard`);

    return {
      jobId: actualJobId,
      totalScanned: rawResult.foundNumbers.length,
      totalFiltered: filteredList.length,
      topCandidates,
      allCandidates: filteredList,
      logs,
    };
  }
}

export const hunterService = new HunterService();
