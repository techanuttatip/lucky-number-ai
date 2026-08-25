import { createClient } from "@supabase/supabase-js";
import { INITIAL_CANDIDATE_POOL } from "../src/lib/scraper/mock-pool.ts";

const url = "https://dxjjqkohxumxngimouop.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4ampxa29oeHVteG5naW1vdW9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxMDU1MDEsImV4cCI6MjEwMjY4MTUwMX0.rbuxETgZ2yuClF3Bbs-cdOSs_uFETKHGaaUNeeZnB8c";

const supabase = createClient(url, key);

async function seed() {
  console.log("🚀 Seeding initial numbers into Supabase PostgreSQL...");

  const formattedRows = INITIAL_CANDIDATE_POOL.map((item) => {
    const cleanNumber = item.rawNumber.replace(/\D/g, "");
    const digits = cleanNumber.split("").map((d) => parseInt(d, 10));
    const totalSum = digits.reduce((a, b) => a + (isNaN(b) ? 0 : b), 0);

    return {
      raw_number: cleanNumber,
      clean_number: cleanNumber,
      provider: item.provider,
      price: item.price,
      package_detail: item.packageDetail,
      buy_url: item.buyUrl,
      total_sum: totalSum,
      status: "available",
      is_active: true,
    };
  });

  try {
    const { data, error } = await supabase
      .from("numbers")
      .upsert(formattedRows, { onConflict: "raw_number" })
      .select();

    if (error) {
      console.error("❌ Error seeding numbers:", error.message);
    } else {
      console.log(`✅ Successfully seeded ${data.length} candidate numbers into Supabase!`);
    }
  } catch (err) {
    console.error("❌ Seeding exception:", err);
  }
}

seed();
