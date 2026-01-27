const supabase = require("../config/supabase.js");

const resolveIdentity = async (req, res, next) => {
  try {
    console.log("Resolving identity for user:", req.user);
    const authUserId = req.user.auth_user_id;

    // Doctor
    const { data: doctor } = await supabase
      .from("doctors")
      .select("id")
      .eq("auth_user_id", authUserId)
      .maybeSingle();

    if (doctor) {
      const { data: affiliation } = await supabase
        .from("doctor_hospital_affiliations")
        .select("hospital_ref_code")
        .eq("doctor_id", doctor.id)
        .eq("active", true)
        .maybeSingle();

      req.identity = {
        type: "DOCTOR",
        doctor_id: doctor.id,
        hospital_ref_code: affiliation?.hospital_ref_code || null,
      };
      return next();
    }

    // Hospital Admin
    const { data: hospital } = await supabase
      .from("hospitals")
      .select("hospital_ref_code, country")
      .eq("auth_user_id", authUserId)
      .maybeSingle();

    if (hospital) {
      req.identity = {
        type: "HOSPITAL_ADMIN",
        hospital_ref_code: hospital.hospital_ref_code,
        country: hospital.country,
      };
      return next();
    }

    return res.status(403).json({ error: "User role not registered" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Identity resolution failed" });
  }
};

module.exports = resolveIdentity;
