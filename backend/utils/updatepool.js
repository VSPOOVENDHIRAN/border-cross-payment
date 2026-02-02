const sql = require("../config/db.js");

/**
 * Debit money from destination country pool (DEMO)
 */
async function debitCountryPool(countryCode, amount) {
  // 1️⃣ Fetch pool
  const pools = await sql`
    SELECT *
    FROM public.country_pools
    WHERE country_code = ${countryCode}
      AND currency_code = 'USD'
      AND pool_status = 'ACTIVE'
      AND is_demo = true
    FOR UPDATE
  `;

  if (pools.length === 0) {
    throw new Error("Country pool not found");
  }

  const pool = pools[0];
  const available =
    Number(pool.total_balance) - Number(pool.reserved_balance);

  if (available < amount) {
    throw new Error("Insufficient country pool balance");
  }

  // 2️⃣ Debit pool
  await sql`
    UPDATE public.country_pools
    SET total_balance = total_balance - ${amount},
        last_updated_at = now()
    WHERE pool_id = ${pool.pool_id}
  `;

  return {
    pool_id: pool.pool_id,
    country_code: pool.country_code,
    debited_amount: amount,
    balance_after: available - amount
  };
}

module.exports = debitCountryPool;
