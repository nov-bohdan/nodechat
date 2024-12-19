const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

class DbClient {
  static client = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
  );
}

module.exports = DbClient;
