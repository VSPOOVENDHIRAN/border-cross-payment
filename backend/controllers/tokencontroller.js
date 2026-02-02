// controllers/amlController.js

const {
  fetchEmergencyCases,
  fetchHospitals,
  buildHospitalProfiles,
  applyAmlRules,
  detectLifeThreateningMisuse
} = require("../utils/aml_helper.js");

/**
 * Express controller for AML dashboard
 */
const buildAmlDashboard = async (req, res) => {
  try {
    console.log("Building AML dashboard...");

    const [cases, hospitals] = await Promise.all([
      fetchEmergencyCases(),
      fetchHospitals()
    ]);

    console.log(
      `Fetched ${cases.length} emergency cases and ${Object.keys(hospitals).length} hospitals.`
    );

    const profiles = buildHospitalProfiles(cases);
    console.log("Built hospital profiles.");

    const amlAlerts = [
      ...applyAmlRules(profiles, hospitals),
      ...detectLifeThreateningMisuse(cases)
    ];

    console.log(`Generated ${amlAlerts.length} AML alerts.`);

    // ✅ SEND RESPONSE CORRECTLY
    return res.status(200).json({
      generatedAt: new Date().toISOString(),
      totalEmergencyCases: cases.length,
      hospitalProfiles: profiles,
      amlAlerts
    });

  } catch (error) {
    console.error("AML dashboard error:", error);
    return res.status(500).json({
      error: "Failed to build AML dashboard"
    });
  }
};


const fetchpayment = require("../utils/fetchpayment");

// fixed demo FX assumptions
const FX_RATE = 83;
const FX_MARGIN = 0.005;

const demoTransactionFromEmergency = async (req, res) => {
  try {
    console.log("Processing demo transaction from emergency...");
    const { emergencyId } = req.body;
    console.log("Emergency ID:", emergencyId);

    if (!emergencyId) {
      return res.status(400).json({
        status: "FAILED",
        error: "emergencyId is required"
      });
    }


    // 1️⃣ Fetch sending amount from emergency_cases
    const emergency = await fetchpayment(emergencyId);

    const sendingAmount = Number(emergency.sending_amount);

    // 2️⃣ FX calculation (demo)
    const usdBeforeMargin = sendingAmount / FX_RATE;
    const margin = usdBeforeMargin * FX_MARGIN;
    const receivingAmount = +(usdBeforeMargin - margin).toFixed(2);

    // 3️⃣ Respond (no real money movement)
    return res.status(200).json({
      status: "SUCCESS",
      emergency_id: emergency.emergency_id,
      sender_hospital: emergency.source_hospital_ref_code,
      receiver_hospital: emergency.destination_hospital_ref_code,
      sending: {
        amount: sendingAmount,
        currency: emergency.sending_currency
      },
      receiving: {
        amount: receivingAmount,
        currency: "USD"
      },
      fx: {
        rate: FX_RATE,
        margin_percent: "0.5%"
      },
      note: "Sending amount fetched directly from emergency_cases (demo)"
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: "FAILED",
      error: err.message
    });
  }
};




const sql = require("../config/db.js");


/**
 * Run demo payment using prefunded country pool
/////aram {string} emergencyId
 */
const runDemoPayment = async (req, res) => {
  try {
    const { emergencyId } = req.body;
    console.log("Running demo payment for emergency ID:", emergencyId);

    if (!emergencyId) {
      return res.status(400).json({
        status: "FAILED",
        error: "emergencyId is required"
      });
    }

    console.log("Running demo payment using prefunded country pool...");

    // 1️⃣ Fetch emergency
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
      return res.status(404).json({
        status: "FAILED",
        error: "Emergency case not found"
      });
    }

    const emergency = emergencies[0];
    const sendingAmount = Number(emergency.estimated_treatment_cost);

    // 2️⃣ FX calculation
    const usdBeforeMargin = sendingAmount / FX_RATE;
    const margin = usdBeforeMargin * FX_MARGIN;
    const receivingAmount = +(usdBeforeMargin - margin).toFixed(2);

    // 3️⃣ Fetch destination country pool
    const pools = await sql`
      SELECT *
      FROM public.country_pools
      WHERE country_code = ${emergency.destination_country}
        AND currency_code = 'USD'
        AND pool_status = 'ACTIVE'
        AND is_demo = true
    `;

    if (pools.length === 0) {
      return res.status(400).json({
        status: "FAILED",
        error: "Destination country pool not available"
      });
    }

    const pool = pools[0];
    const availableBalance =
      Number(pool.total_balance) - Number(pool.reserved_balance);

    if (availableBalance < receivingAmount) {
      return res.status(400).json({
        status: "FAILED",
        error: "Insufficient country pool balance"
      });
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
        amount_source,
        source_currency,
        amount_destination,
        destination_currency,
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

    // ✅ SEND RESPONSE (THIS WAS MISSING)
    return res.status(200).json({
      status: "SUCCESS",
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
    });

  } catch (err) {
    console.error("Demo payment error:", err);
    return res.status(500).json({
      status: "FAILED",
      error: err.message
    });
  }
};



module.exports = {
  buildAmlDashboard,
  demoTransactionFromEmergency,
  runDemoPayment
};



