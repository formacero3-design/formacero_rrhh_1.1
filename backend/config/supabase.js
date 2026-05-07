import dotenv from "dotenv";
import fs from "fs";
import path from "path";

const rootEnvPath = path.resolve(process.cwd(), ".env");
const backendEnvPath = path.resolve(process.cwd(), "backend", ".env");

if (fs.existsSync(rootEnvPath)) {
  dotenv.config({ path: rootEnvPath });
} else if (fs.existsSync(backendEnvPath)) {
  dotenv.config({ path: backendEnvPath });
} else {
  dotenv.config();
}

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error(
    "Missing SUPABASE_URL environment variable. Set SUPABASE_URL in Vercel Environment Variables or in backend/.env for local development."
  );
}

if (!supabaseKey) {
  throw new Error(
    "Missing SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY environment variable. Set it in Vercel Environment Variables or backend/.env."
  );
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn(
    "⚠️ No se encontró SUPABASE_SERVICE_ROLE_KEY. El backend usará la clave anon, lo cual puede bloquear inserciones en tablas con RLS como contactos_emergencia."
  );
}

console.log("SUPABASE_URL:", supabaseUrl);
console.log("SUPABASE_KEY_TYPE:", process.env.SUPABASE_SERVICE_ROLE_KEY ? "service_role" : "anon");

export const supabase = createClient(supabaseUrl, supabaseKey);