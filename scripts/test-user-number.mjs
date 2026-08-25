import { scorePhoneNumber } from "../src/lib/numerology/scorer.ts";
import { BIRTH_RULES } from "../src/lib/numerology/birth-rules.ts";

const num = "0966959235";
const result = scorePhoneNumber(num, {
  birthDay: "monday",
  career: "sales_trading",
  goals: ["wealth", "charm_love"],
});

console.log("=== ANALYSIS FOR 096-695-9235 ===");
console.log("Clean:", result.rawNumber);
console.log("Total Sum:", result.totalSum, `(${result.sumRule?.title})`);
console.log("Score:", result.totalScore, "/ 100");
console.log("Decomposed Pairs in last 7 digits:");
result.decomposedPairs.forEach((p) => {
  console.log(`- Pair ${p.pair}: ${p.rule?.title} (Score: +${p.scoreContribution})`);
});
console.log("Dangerous pairs:", result.dangerousPairsFound);
console.log("Has Kala Kinee:", result.hasKalaKinee);
console.log("Energy Profile:", result.energyProfile);
