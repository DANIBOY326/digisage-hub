// Mirrors the `public.registrations` table in Supabase.
// Kept in one place so the frontend never drifts from the schema.
export interface Registration {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  course_id: string;
  course_name: string;
  cohort_preference: string;
  motivation: string;
  status: "pending" | "reviewed" | "contacted";
  payment_method: "bank_transfer" | "card" | "online_gateway";
  payment_type: "full" | "part";
  payment_status: "pending" | "verified" | "approved" | "rejected";
  payment_amount: number | null;
  payment_currency: string;
  payment_reference: string | null;
  payment_evidence_path: string | null;
  created_at: string;
  updated_at: string;
}
