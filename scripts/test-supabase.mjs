import { createClient } from "@supabase/supabase-js";

const url = "https://dxjjqkohxumxngimouop.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4ampxa29oeHVteG5naW1vdW9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxMDU1MDEsImV4cCI6MjEwMjY4MTUwMX0.rbuxETgZ2yuClF3Bbs-cdOSs_uFETKHGaaUNeeZnB8c";

const supabase = createClient(url, key);

async function check() {
  console.log("Checking Supabase connection to:", url);
  try {
    const { data, error } = await supabase.from("numbers").select("*").limit(5);
    if (error) {
      console.log("Response from Supabase:", error.message, `(Code: ${error.code})`);
      if (error.code === "42P01") {
        console.log("💡 The table 'numbers' does not exist yet. You can run the migration SQL in Supabase SQL Editor!");
      }
    } else {
      console.log("✅ Supabase connection successful! Found records:", data.length);
    }
  } catch (err) {
    console.error("Connection error:", err);
  }
}

check();
