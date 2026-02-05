const sql = require("../config/db.js");
const pool = require("../config/db.js");
const supabase = require("../config/supabase.js");
const path = require("path");

const getEmergencyCasesByHospital = async (req, res) => {
  try {
    const { auth_user_id } = req.user;

    // 1️⃣ Fetch hospital to get hospital_ref_code
    const hospitals = await sql`
      SELECT hospital_ref_code
      FROM public.hospitals
      WHERE auth_user_id = ${auth_user_id}
      LIMIT 1
    `;

    if (hospitals.length === 0) {
      return res.status(404).json({
        error: "Hospital record not found for this user",
      });
    }

    const hospitalRefCode = hospitals[0].hospital_ref_code;

    console.log("Fetching emergency cases for hospital:", hospitalRefCode);

    const emergencies = await sql`
      SELECT
        emergency_id,
        status,
        source_country,
        destination_hospital_ref_code,
        destination_country,
        patient_age,
        patient_gender,
        primary_diagnosis_code,
        urgency_level,
        life_threatening,
        estimated_treatment_cost,
        currency,
        created_at
      FROM public.emergency_cases
      WHERE source_hospital_ref_code = ${hospitalRefCode}
      ORDER BY created_at DESC
    `;

    return res.status(200).json({
      hospital_ref_code: hospitalRefCode,
      count: emergencies.length,
      emergencies: emergencies,
    });
  } catch (err) {
    console.error("Fetch emergency cases error:", err);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

const getEmergenciesForDestinationHospital = async (req, res) => {
  try {
    const { auth_user_id } = req.user;

    console.log("Fetching emergencies for destination hospital...");

    /* ---------------- FETCH HOSPITAL ---------------- */

    const hospital = await sql`
      SELECT hospital_ref_code
      FROM public.hospitals
      WHERE auth_user_id = ${auth_user_id}
      LIMIT 1
    `;

    if (hospital.length === 0) {
      return res.status(404).json({
        error: "Hospital not found"
      });
    }

    const hospital_ref_code = hospital[0].hospital_ref_code;

    /* ---------------- FETCH EMERGENCIES ---------------- */

    const emergencies = await sql`
      SELECT
        emergency_id,
        status,
        source_country,
        destination_country,

        patient_age,
        patient_gender,
        patient_nationality,

        urgency_level,
        treatment_complexity,
        life_threatening,
        required_specialty,

        estimated_treatment_cost,
        currency,

        created_at
      FROM public.emergency_cases
      WHERE destination_hospital_ref_code = ${hospital_ref_code}
        AND status IN (
          'WAITING_FOR_HOSPITAL',
          'ACCEPTED',
          'IN_PROGRESS'
        )
      ORDER BY created_at DESC
      LIMIT 50
    `;

    return res.status(200).json({
      count: emergencies.length,
      emergencies
    });

  } catch (err) {
    console.error("Fetch destination hospital emergencies error:", err);
    return res.status(500).json({
      error: err.message
    });
  }
};


module.exports = { getEmergencyCasesByHospital };


module.exports = { getEmergencyCasesByHospital, getEmergenciesForDestinationHospital };