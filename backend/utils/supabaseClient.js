import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

console.log("✅ SUPABASE_URL:", process.env.SUPABASE_URL); // should print your URL

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default supabase;
