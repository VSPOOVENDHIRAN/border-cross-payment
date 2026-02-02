// utils/aml_helper.js
const sql = require("../config/db.js");

/**
 * Detect excessive use of life-threatening flag
 */
function detectLifeThreateningMisuse(cases) {

    console.log("Analyzing life-threatening flags in emergency cases...");
  const map = {};

  cases.forEach(ec => {
    if (ec.life_threatening) {
      map[ec.source_hospital_ref_code] =
        (map[ec.source_hospital_ref_code] || 0) + 1;
    }
  });

  console.log("Detecting life-threatening misuse...");

  return Object.entries(map)
    .filter(([_, count]) => count > 10)
    .map(([hospital, count]) => ({
      hospital_ref_code: hospital,
      rule: "LIFE_THREATENING_OVERUSE",
      message: "Excessive use of life-threatening flag",
      count
    }));
}

/**
 * Apply AML rules on hospital profiles
 */
function applyAmlRules(profiles, hospitals) {
    console.log("Applying AML rules to hospital profiles...");
  const alerts = [];

  Object.entries(profiles).forEach(([refCode, profile]) => {
    const hospital = hospitals[refCode];
    if (!hospital) return;

    // RULE 1: New hospital sending too many emergencies
    if (hospital.hospital_age_months < 6 && profile.sentCount > 5) {
      alerts.push({
        hospital_ref_code: refCode,
        rule: "NEW_HOSPITAL_HIGH_ACTIVITY",
        message: "New hospital sending unusually high number of emergency cases"
      });
    }

    // RULE 2: High average treatment cost
    const avgCost =
      profile.totalSentAmount / Math.max(profile.sentCount, 1);

    if (avgCost > 1000000) {
      alerts.push({
        hospital_ref_code: refCode,
        rule: "HIGH_AVERAGE_COST",
        message: "Average emergency treatment cost unusually high"
      });
    }

    // RULE 3: Excessive receiving activity
    if (profile.receivedCount > 20) {
      alerts.push({
        hospital_ref_code: refCode,
        rule: "HIGH_RECEIVING_VOLUME",
        message: "Hospital receiving unusually high number of emergency cases"
      });
    }
  });

  console.log(`Generated ${alerts.length} AML alerts.`);

  return alerts;
}

/**
 * Build per-hospital AML profiles
 */
function buildHospitalProfiles(cases) {

    console.log("Building hospital profiles from emergency cases...");
  const profiles = {};

  cases.forEach(ec => {
    const sender = ec.source_hospital_ref_code;
    const receiver = ec.destination_hospital_ref_code;
    const amount = Number(ec.estimated_treatment_cost);

    if (!profiles[sender]) {
      profiles[sender] = {
        sentCount: 0,
        receivedCount: 0,
        totalSentAmount: 0,
        totalReceivedAmount: 0
      };
    }

    if (!profiles[receiver]) {
      profiles[receiver] = {
        sentCount: 0,
        receivedCount: 0,
        totalSentAmount: 0,
        totalReceivedAmount: 0
      };
    }

    profiles[sender].sentCount++;
    profiles[sender].totalSentAmount += amount;

    profiles[receiver].receivedCount++;
    profiles[receiver].totalReceivedAmount += amount;
  });
   console.log("Built hospital profiles:", profiles);
  return profiles;
}

/**
 * Fetch hospital metadata
 */
async function fetchHospitals() {

    console.log("Fetching hospital metadata from database...");
  const rows = await sql`
    SELECT
      hospital_ref_code,
      hospital_name,
      country,
      verified_at,
      created_at
    FROM public.hospitals
  `;

  const map = {};
  rows.forEach(h => {
    const months =
      (Date.now() - new Date(h.created_at)) /
      (1000 * 60 * 60 * 24 * 30);

    map[h.hospital_ref_code] = {
      hospital_ref_code: h.hospital_ref_code,
      hospital_name: h.hospital_name,
      country: h.country,
      verified_at: h.verified_at,
      created_at: h.created_at,
      hospital_age_months: Math.floor(months)
    };
  });

  console.log(`Fetched ${rows.length} hospitals.`);

  return map;
}

/**
 * Fetch emergency cases
 */
async function fetchEmergencyCases() {
    console.log("Fetching emergency cases from database...");
  const rows = await sql`
    SELECT
      emergency_id,
      source_hospital_ref_code,
      destination_hospital_ref_code,
      estimated_treatment_cost,
      currency,
      life_threatening,
      urgency_level,
      created_at
    FROM public.emergency_cases
  `;
  console.log(`Fetched ${rows.length} emergency cases.`);
  return rows;
}

module.exports = {
  fetchEmergencyCases,
  fetchHospitals,
  buildHospitalProfiles,
  applyAmlRules,
  detectLifeThreateningMisuse
};
