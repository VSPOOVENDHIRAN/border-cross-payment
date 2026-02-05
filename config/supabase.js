// config/supabase.js - MOCK VERSION FOR DEMO
const { createClient } = require("@supabase/supabase-js");
require('dotenv').config();

let supabase;

if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
  supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
} else {
  console.warn("⚠️ Supabase credentials not found. Using MOCK client for UI demonstration.");
  // Mock the Supabase client
  supabase = {
    from: (table) => ({
      select: () => ({
        eq: () => ({
          maybeSingle: async () => ({ data: null, error: null }),
          order: () => ({ data: [], error: null })
        }),
        order: () => ({ data: [], error: null }),
        maybeSingle: async () => ({ data: null, error: null }),
        data: [],
        error: null
      }),
      insert: async () => ({ data: null, error: null }),
      update: () => ({ eq: () => ({ data: null, error: null }) })
    }),
    auth: {
      getUser: async (token) => ({ data: { user: { id: 'mock-id', email: 'admin@demo.com' } }, error: null }),
      signInWithPassword: async ({ email, password }) => ({
        data: {
          session: { access_token: 'mock-token', refresh_token: 'mock-refresh' },
          user: { id: 'mock-id', email, role: 'hospital_admin' }
        },
        error: null
      })
    },
    storage: {
      from: () => ({
        upload: async () => ({ data: { path: 'mock-path' }, error: null }),
        getPublicUrl: () => ({ data: { publicUrl: 'https://via.placeholder.com/150' } })
      })
    }
  };
}

module.exports = supabase;
