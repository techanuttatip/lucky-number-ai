// Test script to verify deterministic numerology engine
import { scorePhoneNumber } from "../src/lib/numerology/scorer.ts";
import { BIRTH_RULES } from "../src/lib/numerology/birth-rules.ts";
import { PAIR_RULES_MAP } from "../src/lib/numerology/pairs-data.ts";

console.log("==================================================");
console.log("🚀 TESTING THAI NUMEROLOGY DETERMINISTIC ENGINE");
console.log("==================================================");

// Case 1: Ultra Auspicious Number for Tech Developer born on Sunday (Forbidden 6)
// Sunday forbidden digit: 6
// Let's test number 095-495-1545 (Digits: 0,9,5, 4,9,5,1,5,4,5 - No 6!)
// Pairs in last 7 (4951545): 49, 95, 51, 15, 54, 45 -> ALL A+ / A Tier!
const res1 = scorePhoneNumber("0954951545", {
  birthDay: "sunday",
  career: "tech_developer",
  goals: ["wealth", "wisdom_peace"],
  provider: "AIS",
  price: 2990,
});

console.log("\n[CASE 1] Auspicious Tech Developer Number (095-495-1545):");
console.log(`- Formatted: ${res1.formattedNumber}`);
console.log(`- Total Sum: ${res1.totalSum} (${res1.sumRule?.title})`);
console.log(`- Total Score: ${res1.totalScore} / 100`);
console.log(`- Pair Score: ${res1.pairScore}, Birth Score: ${res1.birthScore}, Career Score: ${res1.careerScore}`);
console.log(`- Has Kala Kinee: ${res1.hasKalaKinee}`);
console.log(`- Dangerous Pairs: ${res1.dangerousPairsFound.join(", ") || "None"}`);
console.log(`- Is Top Candidate: ${res1.isTopCandidate}`);
console.log(`- Energy Profile:`, res1.energyProfile);

// Case 2: Number with Dangerous Pairs (18, 13) e.g. 081-181-3107
const res2 = scorePhoneNumber("0811813107", {
  birthDay: "monday",
  career: "sales_trading",
});

console.log("\n[CASE 2] Dangerous Number with 18, 13, 07 (081-181-3107):");
console.log(`- Total Score: ${res2.totalScore} / 100`);
console.log(`- Dangerous Pairs Found: ${res2.dangerousPairsFound.join(", ")}`);
console.log(`- Is Top Candidate: ${res2.isTopCandidate}`);

// Case 3: Number with Kala Kinee (Sunday born with digit 6) e.g. 089-666-5665
const res3 = scorePhoneNumber("0896665665", {
  birthDay: "sunday", // Kala Kinee is 6!
});

console.log("\n[CASE 3] Sunday Born with Kala Kinee digit 6 (089-666-5665):");
console.log(`- Has Kala Kinee: ${res3.hasKalaKinee}`);
console.log(`- Kala Kinee Digits Found: ${res3.kalaKineeDigitsFound.join(", ")}`);
console.log(`- Birth Score: ${res3.birthScore}`);
console.log(`- Total Score: ${res3.totalScore} / 100`);

console.log("\n✅ All test assertions ready!");
