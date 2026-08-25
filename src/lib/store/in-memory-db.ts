import { ScoredNumber, HunterJob, SearchCriteria } from "@/types";
import { INITIAL_CANDIDATE_POOL } from "../scraper/mock-pool";
import { scorePhoneNumber } from "../numerology/scorer";
import shopeePoolData from "../data/shopee-stores-pool.json";

// Global singleton in-memory database
class InMemoryDatabase {
  private numbers: Map<string, ScoredNumber> = new Map();
  private jobs: Map<string, HunterJob> = new Map();
  private isInitialized = false;

  constructor() {
    this.initDefaultPool();
  }

  private initDefaultPool() {
    if (this.isInitialized) return;
    
    // Seed default candidate pool
    INITIAL_CANDIDATE_POOL.forEach((item) => {
      const scored = scorePhoneNumber(item.rawNumber, {
        id: `num_${item.rawNumber}`,
        provider: item.provider,
        price: item.price,
        source: item.source,
        packageDetail: item.packageDetail,
        buyUrl: item.buyUrl,
      });
      this.numbers.set(scored.id, scored);
    });

    // Seed 649 Shopee Store numbers (Mobilesphone, MoranetShop, 7SIMNET)
    if (Array.isArray(shopeePoolData)) {
      shopeePoolData.forEach((item: any) => {
        const scored = scorePhoneNumber(item.rawNumber, {
          id: `shopee_${item.rawNumber}`,
          provider: item.provider,
          price: item.price,
          source: item.source,
          packageDetail: `${item.source} • ผลรวม ${item.totalSum}`,
          buyUrl: item.buyUrl || `https://shopee.co.th/search?keyword=ซิมเบอร์มงคล+${item.rawNumber}`,
        });
        this.numbers.set(scored.id, scored);
      });
    }

    // Seed sample scheduled jobs
    const sampleJob: HunterJob = {
      id: "job_ais_tech_sunday",
      title: "ค้นหาเบอร์โปรแกรมเมอร์วันอาทิตย์ (AIS 5G)",
      criteria: {
        birthDay: "sunday",
        career: "tech_developer",
        goals: ["wealth", "wisdom_peace"],
        providers: ["AIS"],
        budgetMax: 5000,
      },
      status: "completed",
      frequency: "hourly",
      totalFound: 14,
      topCandidatesCount: 3,
      lastRunAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
      nextRunAt: new Date(Date.now() + 1000 * 60 * 25).toISOString(),
      logs: [
        "[AIS Hunter] ตรวจพบเบอร์ใหม่ 14 เบอร์",
        "[Rule Engine] วิเคราะห์คะแนนเลขศาสตร์เสร็จสิ้น",
        "[AI Judge] สังเคราะห์เบอร์ TOP 3 สำเร็จ",
      ],
    };
    this.jobs.set(sampleJob.id, sampleJob);

    this.isInitialized = true;
  }

  getAllNumbers(): ScoredNumber[] {
    return Array.from(this.numbers.values());
  }

  getNumberById(id: string): ScoredNumber | undefined {
    return this.numbers.get(id);
  }

  getNumberByCleanDigits(digits: string): ScoredNumber | undefined {
    const clean = digits.replace(/\D/g, "");
    return Array.from(this.numbers.values()).find((n) => n.rawNumber === clean);
  }

  saveNumber(scored: ScoredNumber) {
    this.numbers.set(scored.id, scored);
  }

  saveBulkNumbers(items: ScoredNumber[]) {
    items.forEach((item) => this.numbers.set(item.id, item));
  }

  getAllJobs(): HunterJob[] {
    return Array.from(this.jobs.values());
  }

  getJobById(id: string): HunterJob | undefined {
    return this.jobs.get(id);
  }

  saveJob(job: HunterJob) {
    this.jobs.set(job.id, job);
  }
}

// Ensure singleton across Next.js API reloads
const globalForDb = globalThis as unknown as { inMemoryDb?: InMemoryDatabase };
export const db = globalForDb.inMemoryDb || new InMemoryDatabase();
if (process.env.NODE_ENV !== "production") globalForDb.inMemoryDb = db;
