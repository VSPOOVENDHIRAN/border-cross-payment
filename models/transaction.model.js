const sql = require("../config/db.js");

/**
 * Create a new emergency case
 */
const createEmergencyCase = async (data) => {
  return await sql`
    INSERT INTO public.emergency_cases (
      source_country, destination_hospital_ref_code, destination_country,
      patient_age, patient_gender, patient_nationality,
      primary_diagnosis_code, diagnosis_code_system, life_threatening,
      urgency_level, treatment_complexity, consciousness_status,
      airway_status, breathing_status, circulation_status,
      primary_procedure_code, procedure_code_system, required_specialty,
      estimated_treatment_cost, currency, automation_justification_code,
      emergency_override_consent, consent_reason, created_by
    ) VALUES (
      ${data.source_country}, ${data.destination_hospital_ref_code}, ${data.destination_country},
      ${data.patient_age}, ${data.patient_gender}, ${data.patient_nationality},
      ${data.primary_diagnosis_code}, ${data.diagnosis_code_system || 'ICD-10'}, ${data.life_threatening},
      ${data.urgency_level}, ${data.treatment_complexity}, ${data.consciousness_status},
      ${data.airway_status}, ${data.breathing_status}, ${data.circulation_status},
      ${data.primary_procedure_code}, ${data.procedure_code_system || 'CPT'}, ${data.required_specialty},
      ${data.estimated_treatment_cost}, ${data.currency || 'USD'}, ${data.automation_justification_code},
      ${data.emergency_override_consent}, ${data.consent_reason}, ${data.created_by}
    )
    RETURNING emergency_id, status, created_at
  `;
};

/**
 * Get all emergency cases
 */
const getAllEmergencyCases = async () => {
  return await sql`
    SELECT * FROM public.emergency_cases
    ORDER BY created_at DESC
  `;
};

/**
 * Get emergency cases by destination hospital
 */
const getEmergencyCasesByHospital = async (hospitalRefCode) => {
  return await sql`
    SELECT * FROM public.emergency_cases
    WHERE destination_hospital_ref_code = ${hospitalRefCode}
    ORDER BY created_at DESC
  `;
};

module.exports = {
  createEmergencyCase,
  getAllEmergencyCases,
  getEmergencyCasesByHospital
};
