import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

const supabaseUrl = "https://dxjjqkohxumxngimouop.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4ampxa29oeHVteG5naW1vdW9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxMDU1MDEsImV4cCI6MjEwMjY4MTUwMX0.rbuxETgZ2yuClF3Bbs-cdOSs_uFETKHGaaUNeeZnB8c";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function wipeAll() {
  console.log("🧹 1. Wiping all numbers from Supabase PostgreSQL...");
  try {
    const { data, error } = await supabase
      .from("numbers")
      .delete()
      .neq("raw_number", "0000000000"); // deletes all rows

    if (error) {
      console.error("Supabase clear error:", error.message);
    } else {
      console.log("✅ Supabase 'numbers' table cleared successfully!");
    }
  } catch (err) {
    console.error("Exception clearing Supabase:", err);
  }

  console.log("🧹 2. Clearing local static pool JSON...");
  const poolPath = path.resolve("./src/lib/data/shopee-stores-pool.json");
  fs.mkdirSync(path.dirname(poolPath), { recursive: true });
  fs.writeFileSync(poolPath, "[]", "utf8");
  console.log("✅ Local shopee-stores-pool.json set to []");
}

wipeAll();
