const sql = require("../config/db.js");

/**
 * Fetch sending amount & sender details for an emergency case
 */
async function fetchpayment(emergencyId) {
  const rows = await sql`
    SELECT
      emergency_id,
      source_hospital_ref_code,
      destination_hospital_ref_code,
      estimated_treatment_cost AS sending_amount,
      currency AS sending_currency,
      source_country,
      destination_country,
      created_at
    FROM public.emergency_cases
    WHERE emergency_id = ${emergencyId}
  `;

  if (rows.length === 0) {
    throw new Error("Emergency case not found");
  }

  return rows[0];
}

module.exports = fetchpayment;
