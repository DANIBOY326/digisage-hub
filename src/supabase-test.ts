import { supabase } from "./lib/supabaseClient";

async function testSupabase() {
  console.log("=== SUPABASE TEST ===");

  const { data, error } = await supabase.auth.getSession();

  console.log("Session:", data.session);
  console.log("Auth error:", error);

  const { data: buckets, error: storageError } =
    await supabase.storage.listBuckets();

  console.log("Buckets:", buckets);
  console.log("Storage error:", storageError);
}

testSupabase();