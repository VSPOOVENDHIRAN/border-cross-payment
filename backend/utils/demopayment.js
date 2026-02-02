const sql = require("../config/db.js");

// 🔧 Demo FX assumptions
const FX_RATE = 83;        // INR → USD
const FX_MARGIN = 0.005;  // 0.5%

/**
 * Run demo payment using prefunded country pool
 * @param {string} emergencyId
 */
async function runDemoPayment(emergencyId) {
  // 1️⃣ Fetch emergency case (sending amount)
  const emergencies = await sql`
    SELECT
      emergency_id,
      source_hospital_ref_code,
      destination_hospital_ref_code,
      destination_country,
      estimated_treatment_cost,
      currency
    FROM public.emergency_cases
    WHERE emergency_id = ${emergencyId}
  `;

  if (emergencies.length === 0) {
    throw new Error("Emergency case not found");
  }

  const emergency = emergencies[0];
  const sendingAmount = Number(emergency.estimated_treatment_cost);

  // 2️⃣ FX calculation
  const usdBeforeMargin = sendingAmount / FX_RATE;
  const margin = usdBeforeMargin * FX_MARGIN;
  const receivingAmount = +(usdBeforeMargin - margin).toFixed(2);

  // 3️⃣ Fetch destination country pool (USD, DEMO)
  const pools = await sql`
    SELECT *
    FROM public.country_pools
    WHERE country_code = ${emergency.destination_country}
      AND currency_code = 'USD'
      AND pool_status = 'ACTIVE'
      AND is_demo = true
  `;

  if (pools.length === 0) {
    throw new Error("Destination country pool not available");
  }

  const pool = pools[0];
  const availableBalance =
    Number(pool.total_balance) - Number(pool.reserved_balance);

  if (availableBalance < receivingAmount) {
    throw new Error("Insufficient country pool balance");
  }

  // 4️⃣ Debit destination pool
  await sql`
    UPDATE public.country_pools
    SET total_balance = total_balance - ${receivingAmount},
        last_updated_at = now()
    WHERE pool_id = ${pool.pool_id}
  `;

  // 5️⃣ Insert demo payment record
  const payments = await sql`
    INSERT INTO public.emergency_payments (
      emergency_id,
      sender_hospital_ref_code,
      receiver_hospital_ref_code,
      sending_amount,
      sending_currency,
      receiving_amount,
      receiving_currency,
      fx_rate,
      fx_margin_percent,
      payment_status,
      aml_status,
      is_demo
    )
    VALUES (
      ${emergency.emergency_id},
      ${emergency.source_hospital_ref_code},
      ${emergency.destination_hospital_ref_code},
      ${sendingAmount},
      ${emergency.currency},
      ${receivingAmount},
      'USD',
      ${FX_RATE},
      0.5,
      'RELEASED',
      'CLEARED',
      true
    )
    RETURNING *
  `;

  // 6️⃣ Return demo result
  return {
    emergency_id: emergency.emergency_id,
    sender_hospital: emergency.source_hospital_ref_code,
    receiver_hospital: emergency.destination_hospital_ref_code,
    sending: {
      amount: sendingAmount,
      currency: emergency.currency
    },
    receiving: {
      amount: receivingAmount,
      currency: "USD"
    },
    fx: {
      rate: FX_RATE,
      margin_percent: "0.5%"
    },
    pool_used: emergency.destination_country,
    payment_record: payments[0],
    note: "Simulated demo payment using prefunded country pool"
  };
}

module.exports = {
  runDemoPayment
};

